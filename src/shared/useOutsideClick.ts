import { useEffect, type RefObject } from 'react'

/** Calls `onOutsideClick` for any pointerdown outside `ref`'s element. Pass
 *  `active=false` to skip attaching the listener while a menu is closed. */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutsideClick()
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => window.removeEventListener('pointerdown', onPointerDown)
  }, [ref, onOutsideClick, active])
}
