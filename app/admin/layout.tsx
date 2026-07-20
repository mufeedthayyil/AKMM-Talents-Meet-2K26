import { DashboardLayout } from '@/components/common/dashboard-layout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
