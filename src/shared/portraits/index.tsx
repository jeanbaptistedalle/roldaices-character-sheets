import { lazy, Suspense } from 'react'

const LazyPortraitPicker = lazy(() =>
  import('./PortraitPicker').then((m) => ({ default: m.PortraitPicker })),
)

/**
 * On-demand portrait picker. The DiceBear avatar library it depends on is heavy
 * and only needed once a user reaches the identity step, so `PortraitPicker.tsx`
 * (and DiceBear with it) is loaded via dynamic import() — keeping DiceBear out
 * of every system's main chunk. A short skeleton shows while the chunk loads.
 *
 * The public API is unchanged: consumers still import `PortraitPicker` from
 * `shared/portraits`. The non-component helpers (`portraitUrl`, etc.) live in
 * `./portraits` and are imported from there directly, so they never pull
 * DiceBear into this barrel.
 */
export function PortraitPicker(props: {
  value: string
  onChange: (imageUri: string) => void
}) {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-stone-900" />}>
      <LazyPortraitPicker {...props} />
    </Suspense>
  )
}
