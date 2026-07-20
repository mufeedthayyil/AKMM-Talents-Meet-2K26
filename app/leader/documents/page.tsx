import { getDocuments } from '@/actions/document-actions';
import { DocumentsTable } from '@/components/tables/documents-table';

export default async function LeaderDocumentsPage() {
  const documents = await getDocuments('LEADER');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Team Downloads & Rules</h1>
        <p className="text-xs text-muted-foreground">
          Access official competition guidelines, schedule notices, and downloadable templates.
        </p>
      </div>

      <DocumentsTable documents={documents} isAdmin={false} />
    </div>
  );
}
