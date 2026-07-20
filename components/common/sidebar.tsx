'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Shield,
  Users,
  GraduationCap,
  Trophy,
  Calendar,
  UserCheck,
  AlertCircle,
  FileText,
  Settings,
  Activity,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

interface SidebarProps {
  role: 'ADMIN' | 'LEADER' | 'ASSISTANT' | 'STUDENT';
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminNav = [
    { title: 'Overview', href: '/admin', icon: LayoutDashboard },
    { title: 'Teams Management', href: '/admin/teams', icon: Shield },
    { title: 'Students Roster', href: '/admin/students', icon: Users },
    { title: 'Programmes Catalog', href: '/admin/programmes', icon: GraduationCap },
    { title: 'Event Schedule', href: '/admin/schedule', icon: Calendar },
    { title: 'Publish Results', href: '/admin/results', icon: Trophy },
    { title: 'Appeals Desk', href: '/admin/appeals', icon: AlertCircle },
    { title: 'Document Storage', href: '/admin/documents', icon: FileText },
    { title: 'Reports & Export', href: '/admin/reports', icon: FileSpreadsheet },
    { title: 'System Settings', href: '/admin/settings', icon: Settings },
    { title: 'Audit Logs', href: '/admin/logs', icon: Activity },
  ];

  const leaderNav = [
    { title: 'Team Overview', href: '/leader', icon: LayoutDashboard },
    { title: 'My Team Members', href: '/leader/my-team', icon: Users },
    { title: 'Assign Students', href: '/leader/assign-students', icon: UserCheck },
    { title: 'Live Leaderboard', href: '/leader/results', icon: Trophy },
    { title: 'Submit Appeals', href: '/leader/appeals', icon: AlertCircle },
    { title: 'Shared Documents', href: '/leader/documents', icon: FileText },
  ];

  const studentNav = [
    { title: 'My Portal', href: '/student', icon: LayoutDashboard },
    { title: 'My Profile', href: '/student/profile', icon: Users },
    { title: 'Assigned Events', href: '/student/programmes', icon: Calendar },
    { title: 'Published Results', href: '/student/results', icon: Trophy },
    { title: 'Print ID Card', href: '/student/id-card', icon: CreditCard },
    { title: 'Downloads & Docs', href: '/student/documents', icon: FileText },
  ];

  const items = role === 'ADMIN' ? adminNav : role === 'STUDENT' ? studentNav : leaderNav;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 z-30 transition-all">
      {/* Brand Header */}
      <div className="h-16 border-b border-border flex items-center px-6 gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
          A
        </div>
        <div>
          <h1 className="font-extrabold text-sm text-foreground tracking-tight">ATMMS 2026</h1>
          <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
            {role} PORTAL
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-transform group-hover:scale-110',
                  isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-muted/30 text-xs text-muted-foreground text-center">
        AKMM Talents Meet v1.0
      </div>
    </aside>
  );
}
