---
name: rauks-rules
description: Use when building or reasoning about anything touching the Rauks (Rauksorg) TTRPG game mechanics — the 6 characteristics (Physique/Perception/Mental/Charisme/Compétences/Relances) rated 2–4 with 18 points, the four action dice (Bleu/Orange/Rouge/Noir), success-under-characteristic resolution, the "Rauks!" symbol and critical successes, relances, échec critique, group Karma (1–4), and the competency list by characteristic. Consult before modeling character data or the creation flow.
---

# Rauks Rules

> **Scope:** This skill covers the **Rauks** (a.k.a. *Rauksorg*) system by
> Thibaut & Quentin Constant only. In this multi-system repo, other TTRPG
> systems have their own rules skills.

Mechanical reference for the **Rauks** tabletop RPG, used to build the
character-sheet app. This is the source of truth for game mechanics in this
project. Covers **rules only** (setting/lore kept to the minimum needed to
understand the mechanics).

> **Source:** *JDR - Rauksorg - V4 Karma et dé noir* (French PDF, rules
> extracted and verified). Game terms kept in French where they are proper
> nouns; mechanics summarized in English.

## Premise (one paragraph)

Players are **Rauks**: elite investigator-knights delivering independent
justice in an alternate 18th-century-onward World Empire. They are
**professionals** — highly competent, expected to succeed in their domain and
to avoid catastrophe elsewhere. The game is narration-first with deliberately
light, calculation-free rules.

## Character creation, in short

The character sheet has the form of a **passeport**. Building a character:

1. **Identity (fiction)** — Origine, Nom, Sexe, Date de naissance, and the
   Rauksorg the character is attached to. All narrative, no stats. See below.
2. **Characteristics** — distribute **18 points** across the **6
   characteristics**, each rated **2–4** (2 = normal, 3 = good, 4 = excellent).
3. **Competencies** — choose a number of competencies **equal to the
   `Compétences` characteristic value**. Each is a named special ability from
   the list below.
4. **Relances** — the `Relances` characteristic value sets how many reroll
   tokens the character has and their recovery rate.
5. **Karma** — a **group** resource (1–4), not per-character. Starts at max.

Tension in point allocation: a *polyvalent* build dumps points into Physique/
Perception/Mental/Charisme (easy rolls, few competencies); a *specialist* build
keeps a core characteristic and buys many Compétences + Relances.

### Identity fields

- **Origine** — ethnicity/culture and the city the character is closest to
  (usually birth city). Special case: **Impériale** — tied to the Empire itself
  (not a city), incl. people from the Imperial city in Antarctica.
- **Nom** — depends on origin, no fixed rule. **Imperials** have no family
  name: a first name + a *trait* earned in adolescence (e.g. *Ghunter
  l'Audacieux*).
- **Sexe** — purely declarative, no administrative weight.
- **Date de naissance** — imperial calendar: 10 months × 6 weeks × 6 days = 360
  days, plus an 11th festival month of 4–5 days.
- **Rauksorg** — the Rauks unit the character is attached to (shown on passport).

## The six characteristics

Each rated **2–4**; **18 points** total to distribute.

| Characteristic | Covers |
|----------------|--------|
| **Physique**   | Strength, endurance, resistance, agility, and fighting (melee). |
| **Perception** | Senses, reflexes, dexterity, discretion, and ranged/shooting. |
| **Mental**     | Knowledge, logic, first aid, tinkering/machines, investigation. |
| **Charisme**   | Persuade, convince, charm, lie, intimidate; read others' intent. |
| **Compétences**| **Meta:** the *number* of competencies the character may hold. |
| **Relances**   | **Meta:** the *number* of relances (rerolls) and their recovery. |

Physique / Perception / Mental / Charisme are the four **rolling**
characteristics. `Compétences` and `Relances` are budgets, not roll targets.

## Actions & resolution

The MJ decides when a roll is needed, which characteristic it uses, whether a
competency is required, and the **difficulty color**.

### The four action dice (custom d6 faces)

One die of each color; difficulty = which color you roll.

| Color            | When to use                                              |
|------------------|----------------------------------------------------------|
| **Bleu** (normal)| Default when nothing complicates the action.             |
| **Orange** (ardu)| Circumstances make it harder.                            |
| **Rouge** (difficile)| Many obstacles oppose the action.                    |
| **Noir** (sans espoir)| Near-impossible, or a competency should have been required but narration allows the attempt. |

Faces per color (custom-printed d6):

| Color | Face results |
|-------|--------------|
| Bleu  | 1 · 2 · 3(réussite critique) · 4 · **R!** · Échec critique? |
| Orange| 1 · Échec simple · 3(réussite critique) · 4 · **R!** · Échec critique? |
| Rouge | 1 · Échec critique · Échec simple · 4 · **R!** · Échec critique? |
| Noir  | Échec simple · Échec critique · Échec simple · 4 · **R!** · Échec critique? |

### Success & failure

- **Success:** die result **≤ the characteristic** used → succeed simply.
- **Failure:** die result **> characteristic**, or an explicit *Échec* face →
  fail, no extra complication.
- **`R!` ("Rauks!")**: succeeds **only if the character holds a competency**
  that can justify it (usually — but not necessarily — the competency the
  action implies).
- Failure consequence (non-combat): the *method* used is **blocked for the rest
  of the scene** — no one may retry that way (except by spending a relance);
  try later or another approach. Does **not** apply to combat rolls.

### Critical success

Triggered by **`3!`** or **`R!`**: the action must first be a success — i.e.
have **3 in the characteristic** (for `3!`) or **hold a competency** (for
`R!`). The player may **add something to the narration**; the MJ validates or
negotiates.

### Relances & échec critique

- **Relances** (reroll tokens) represent stamina/resilience. Spend one to
  reroll a failed or critically-failed roll; the character pays in fatigue.
  Multiple relances on one roll may draw minor complications from the MJ.
- **`Échec critique?`** face is **not** an instant critical failure. But if the
  player then **rerolls**, any failure (even simple) becomes a **critical
  failure** — quite harmful; other players may propose critical effects.

### Opposition, assistance, quality objects

- **Opposition roll:** each side rolls a **different color** (fictional
  advantage → easier color). Simple success = **1**, `R!` = **5**; highest wins;
  tie → easier color wins; both fail → status quo.
- **Assistance:** a helper adds an extra die (declared first), always a
  **different, harder** color (Rouge/Noir). If *either* die succeeds, the action
  succeeds. Can be rerolled independently.
- **Quality objects** assist the same way as a helper.

## Group Karma

- Group score **1–4**, used for **luck** and **reputation** rolls (rolled like
  any other roll, using Karma as the characteristic).
- Starts at **max** each session (unless stated otherwise).
- Lost by *exactions*: a simple one costs **1**, a major one up to **2**.
  Collective by default; can be individualized if a Rauks acts behind the
  group's back. **+1 per successful investigation** in a campaign.

## Combat (summary)

- Turn-based, **alternating between the two teams**; each character acts once
  (plus an optional minor action). When one team is out of unacted characters,
  the other resolves all its remaining ones.
- **Initiative:** MJ decides from the fiction (numbers, ambush, crit, who
  strikes first…); if unclear, **players** have it.
- **Tour Bonus** before turn 1: characters who succeeded an ambush/*Mangouste*
  roll act **simultaneously**, one action only.
- **Ranges:** Corps-à-corps / Combat rapproché / Courte portée / Longue portée
  / Hors de portée — gate which weapons/moves are possible.
- **Getting hit is usually decisive:** one hit → *hors combat*. Rauks/
  protagonists often get an **opposition roll** to resist; on failure they're
  out for the fight.
- **Bagarre** (fists-only brawl): a single touch puts you out; fighting on after
  a hit escalates it into real combat.
- **Blessures:** a downed PC may take a *wound* = characteristic loss until next
  session; a *secourisme* roll gets them back up (a Physique roll lets the
  player choose which characteristic is hit; else the MJ picks, harshly). Wounds
  stack. **Death** is a narrative agreement, never just bad dice.

## Common Rauks capabilities (all Rauks have these)

- **Code & langage Rauks** — players may freely discuss/coordinate their
  characters' actions in a scene.
- **Coordination** — non-acting players may assist others with advice/ideas.
- **Infatigables / temps-mort** — Rauks don't need rest; they use *temps-morts*
  to recover relances or use certain competencies, and can work for days.
- **Privilège Rauks** — testimony presumed true and weightier than others';
  may bear arms anywhere; presumed lawful (incl. lethal) use of their weapon.

## Standard equipment (every Rauks)

Tactical harness (light protection, holster, pouches), a bespoke marked
**Arme à Haute Pression** (the "Revolver Rauks" / "Pacificateur" — 9-shot rotary
magazine, unique per user), passeport, wallet, tactical watch (time, azimuths,
chronometer, alarm), and the essential **carnet de notes**. Gear is fitted, so
it adds no encumbrance.

## Competency list (by characteristic)

Competencies grant special actions, can be **invoked to turn an `R!` into a
success**, and sometimes bundle specific gear. Grouped by the characteristic
used to roll them.

### Physique
- **Gorille** — gorilla-like strength; force doors, throw heavy objects, brutal
  high-damage attacks; very intimidating.
- **Athlète** — extreme-sports mobility (parkour, climbing, swimming, glider);
  outruns/catches anyone. From turn 2, a bonus action at end of each turn on an
  increasingly hard Physique roll.
- **Trompe la Mort** — exceptional physiology control. Once per combat, resist a
  neutralization and stay conscious; wound fully applies after combat.
- **Rauks-Maga** — Rauks hand-to-hand: fast strikes, non-lethal submissions,
  ground fighting, chokes; also lets you use the pressure weapon lethally in
  melee (impossible without it).
- **Maître d'arme** — blade mastery; creates a lethal zone — anyone entering the
  combat circle can be struck automatically (via opposition roll), difficulty
  rising as more enter. Comes with a sabre.

### Perception
- **Sixième Sens** — hyper-senses + a true sixth sense (feel danger, locate
  people through walls); info can be cryptic; cannot be used for social reads.
- **Mangouste** — near-superhuman reflexes; a start-of-combat **bonus action**
  on a successful roll; can force initiative over another's declared action in
  any scene.
- **Filouterie** — prestidigitation, elite pickpocketing (take or plant
  objects, sabotage a foe's gear/weapon), plus lockpicking.
- **Ombre** — stealth/speed; escape watchers' vigilance; in combat, move to
  break line-of-sight even after attacking.
- **Pistolero** — rapid fire: **3 shots in one turn**, each at +1 difficulty
  rank; roll all three dice at once, reroll any at will.
- **Tireur d'élite** — long-range precision (disarm, ricochet, shoot between
  allies). Comes with a black-powder precision rifle + 5 cartridges (~300m).

### Mental
- **Anticipation** — once per session, cancel one or more events (deemed
  "anticipated" and not yet occurred) to retry an approach; narrative fixed by
  crits/luck rolls persists; relances spent during it are lost.
- **Maître Tacticien** — defensive expert; always gets an opposition roll vs
  ranged attacks; finds weak points to amplify allies'/own attacks.
- **Expert** — criminology: fingerprints, ballistics, scientific evidence.
  Comes with an instant camera + fingerprint kit.
- **Médecine Rauks** — heal grave wounds, prevent sequelae, sometimes
  resuscitate; prevents characteristic loss; can autopsy for cause of death.
  Comes with a Rauks medical kit.
- **Pharmacologue** — craft anesthetics/poisons/stimulants (liquid/solid/gas)
  during temps-morts; rudimentary explosives; science/chemistry expert. Comes
  with a pharmacology kit + two free preparations at start.
- **Juriste** — competent lawyer; reads a city's legal order to exploit it,
  finds loopholes/old rules, good at getting a suspect convicted.
- **Ingénieur** — expert tinkerer; mechanics, electronics, applied science.
- **Pistage** — track a person/group, hunt a trail; wilderness survival.
- **Spécialiste des Pièges** — set/disarm/spot traps (tripwires, snares, pits,
  explosive traps); warns that traps are indiscriminate. Comes with nylon cables
  and a folding shovel.

### Social (Charisme)
- **Coordinateur** — born diplomat; builds a local auxiliary network (3–10
  helpers per settlement, more in big cities) for messages, info, observation,
  moving goods, light defense (auxiliaries carry batons).
- **Hypnose** — aggressive hypnosis: suggestions, deep sleep, suppress pain,
  induce malaise, weaken will, alter memory; hardest effects may need a luck
  roll; can look like an assault to witnesses.
- **Beauté fatale** — stunning beauty; seduction techniques. Adults-only tag.
- **Profiler** — read a character's honesty/character/methods after observation;
  works in reverse (infer perpetrator from clues); master interrogator.
- **Autorité naturelle** — commanding presence; directs assisting NPCs and can
  raise a civilian crowd; can impose actions on group members even against
  players' will and spend own relances to reroll allies' rolls (if present);
  strong intimidation.
- **Maître chien** — a trained Rauks dog with the master's characteristics but
  dog-only actions; complex commands need *maître chien* rolls; `R!` always
  fails for the dog; fragile and irreplaceable mid-adventure.
- **Comédie** — acting/impersonation, disguises (swap a hidden disguise in
  seconds, even in a crowd), natural liar. Comes with an all-purpose disguise.

### Karma
- **Réputation immaculée** — renowned; +1 over group Karma on **reputation**
  rolls (cap 4); people remember only their exploits.
- **Le cul bordé de nouilles** — incredibly lucky; +1 over group Karma on
  **luck** rolls (cap 4).

## Modeling notes for the app

- **Characteristics** → 6 fields, each an integer `2..4`, summing to `18`.
  Split them into two groups since two are meta-budgets:
  - **Roll characteristics**: `physique | perception | mental | charisme`.
  - **Budget characteristics**: `competences` (= max competencies held),
    `relances` (= reroll count / recovery).
  Enforce the `2..4` range and the 18-point total at creation.
- **Competency** → id + `characteristic` category (`Physique | Perception |
  Mental | Social | Karma`) + description + optional bundled gear. Keep the list
  **data-driven**. A character holds up to `competences` of them. Note the roll
  category label is **Social** even though the characteristic is **Charisme**.
- **Dice** are **difficulty colors** (`Bleu | Orange | Rouge | Noir`), not
  per-character data — model faces as constants. Success is `roll ≤
  characteristic`; `R!` needs a competency.
- **Karma** → a **group/party** field `1..4`, not per-character; starts at max.
  Two competencies (`Réputation immaculée`, `Le cul bordé de nouilles`) grant a
  personal +1 (capped at 4) on reputation/luck rolls respectively.
- **Identity** → `origine` (free text, or the special `Impériale`), `nom`,
  `sexe` (declarative free text), `dateNaissance` (imperial calendar),
  `rauksorg`. Mostly narrative — validate lightly.
- **Standard equipment** is fixed for every Rauks; competency-bundled gear is
  derived from the chosen competencies, not stored loosely.

## Still worth pulling from the source when needed (not captured here)

- Exact wound/characteristic-loss bookkeeping and secourisme interplay.
- Whether `Compétences`/`Relances` share the same 2–4 range as the rolling
  four (the text states all six are 2–4 with 18 points — assume yes) and any
  edge cases in relance recovery rates per value.
- Detailed range/movement rules and weapon effects table.
- Any per-city origin content the GM introduces per scenario.
