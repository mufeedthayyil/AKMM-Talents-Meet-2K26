import { getDocuments } from '@/actions/document-actions';
import { DocumentsTable } from '@/components/tables/documents-table';

export default async function StudentDocumentsPage() {
  const documents = await getDocuments('STUDENT');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Student Download Center</h1>
        <p className="text-xs text-muted-foreground">
          Download event handbooks, rules, and official notices.
        </p>
      </div>

      <DocumentsTable documents={documents} isAdmin={false} />
    </div>
  );
}
