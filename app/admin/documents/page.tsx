'use client';

import { useState, useEffect } from 'react';
import { AppDocument } from '@/types';
import { getDocuments, uploadDocumentRecord } from '@/actions/document-actions';
import { DocumentsTable } from '@/components/tables/documents-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    const data = await getDocuments('ADMIN');
    setDocuments(data);
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload = {
      title: form.get('title') as string,
      description: form.get('description') as string,
      file_url: form.get('file_url') as string,
      file_size: parseInt(form.get('file_size') as string || '500000', 10),
      file_type: 'application/pdf',
      visibility: form.get('visibility') as any,
    };

    const res = await uploadDocumentRecord(payload);
    if (res.success) {
      toast.success(res.message);
      setModalOpen(false);
      loadDocuments();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Document Storage & Notices</h1>
          <p className="text-xs text-muted-foreground">
            Publish rules, guidelines, result PDFs, and track download analytics.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Publish New Document
        </Button>
      </div>

      <DocumentsTable documents={documents} isAdmin={true} />

      {/* Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish New Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Document Title</label>
                <Input name="title" placeholder="e.g. Official General Rules 2026" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Description</label>
                <Input name="description" placeholder="Brief explanation..." />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">PDF / File URL</label>
                <Input name="file_url" placeholder="https://..." required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Visibility Access</label>
                <select name="visibility" className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm">
                  <option value="PUBLIC">Public (Everyone)</option>
                  <option value="LEADER">Leader & Assistant Only</option>
                  <option value="STUDENT">Student Delegates</option>
                  <option value="ADMIN">Admin Only</option>
                </select>
              </div>

              <Button type="submit" className="w-full">Publish Document</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
