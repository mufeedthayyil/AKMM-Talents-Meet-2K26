import { getAppeals } from '@/actions/appeal-actions';
import { AppealsTable } from '@/components/tables/appeals-table';

export default async function AdminAppealsPage() {
  const appeals = await getAppeals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Appeals Resolution Desk</h1>
        <p className="text-xs text-muted-foreground">
          Review, evaluate, accept, or reject official score and judgement appeals from team leaders.
        </p>
      </div>

      <AppealsTable appeals={appeals} isAdmin={true} />
    </div>
  );
}
