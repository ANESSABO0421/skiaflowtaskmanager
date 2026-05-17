'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Briefcase,
  Receipt,
  Settings,
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Leads',
    href: '/leads',
    icon: Briefcase,
  },
  {
    title: 'Invoices',
    href: '/invoices',
    icon: Receipt,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[260px] border-r min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">
        SkiaFlow
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon

          const isActive =
            pathname === item.href

          return (
            <Link
              key={item.title}
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />

              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}