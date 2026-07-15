// Edge Function: promote a signed-in user to 'user' if they belong to one of the
// allowed Discord servers. Runs on Deno (Supabase Edge runtime), NOT bundled
// into the client — the guild allow-list and the service-role key live here,
// server-side, so the check cannot be bypassed from the browser.
//
// Contract (called via supabase.functions.invoke('discord-membership')):
//   Request  body: { providerToken: string }   // Discord OAuth access token
//   Response body: { role: string, promoted: boolean }
//
// Env (SUPABASE_* are injected automatically; set the guild list yourself):
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
//   DISCORD_ALLOWED_GUILD_IDS  — comma-separated Discord server (guild) ids
//
// Policy: PROMOTE-ONLY. Only ever flips 'guest' -> 'user'. Never downgrades and
// never touches a 'moderator'/'admin'. A user who leaves the server keeps access
// until an admin changes it by hand.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'Missing Authorization header' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Identify the caller from their JWT (the anon client scoped to their token).
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser()
    if (userErr || !user) return json({ error: 'Not authenticated' }, 401)

    const { providerToken } = await req.json().catch(() => ({}))
    if (!providerToken || typeof providerToken !== 'string') {
      return json({ error: 'Missing providerToken' }, 400)
    }

    const allowed = (Deno.env.get('DISCORD_ALLOWED_GUILD_IDS') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    // Which servers is this user in? `guilds` scope is required for this call.
    const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: { Authorization: `Bearer ${providerToken}` },
    })
    if (!guildsRes.ok) {
      return json({ error: `Discord API error (${guildsRes.status})` }, 502)
    }
    const guilds = (await guildsRes.json()) as Array<{ id: string }>
    const isMember = guilds.some((g) => allowed.includes(g.id))

    // Service-role client bypasses RLS so we may set the role (the client never
    // can — profiles updates are admin-only in RLS).
    const admin = createClient(supabaseUrl, serviceKey)
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
    const currentRole: string = profile?.role ?? 'guest'

    let role = currentRole
    let promoted = false
    if (isMember && currentRole === 'guest') {
      // The extra .eq('role', 'guest') guard makes the promote idempotent and
      // race-safe: it can only ever move guest -> user.
      const { error: upErr } = await admin
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', user.id)
        .eq('role', 'guest')
      if (upErr) return json({ error: 'Failed to update role' }, 500)
      role = 'user'
      promoted = true
    }

    return json({ role, promoted }, 200)
  } catch (e) {
    return json({ error: String(e) }, 500)
  }
})
