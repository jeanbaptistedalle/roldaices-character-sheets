import { useSyncExternalStore } from 'react'
import { getThemeMode, subscribeThemeMode } from './index'

export function useThemeMode() {
  return useSyncExternalStore(subscribeThemeMode, getThemeMode)
}
