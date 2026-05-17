'use client'

import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'

export default function Header() {
  const user = useAuthStore(
    (state) => state.user
  )

  const theme = useUiStore(
    (state) => state.theme
  )

  const toggleTheme = useUiStore(
    (state) => state.toggleTheme
  )

  return (
    <header className="h-[70px] border-b px-6 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-lg">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="border px-4 py-2 rounded-lg"
        >
          {theme === 'light'
            ? 'Dark'
            : 'Light'}
        </button>

        <div className="text-sm">
          {user?.email}
        </div>
      </div>
    </header>
  )
}