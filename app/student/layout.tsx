import { DashboardLayout } from '@/components/common/dashboard-layout';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
