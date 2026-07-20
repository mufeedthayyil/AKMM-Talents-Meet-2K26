'use client';

import { useState } from 'react';
import { AppDocument } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBytes } from '@/lib/utils';
import { incrementDownloadCount, deleteDocument } from '@/actions/document-actions';
import { Download, FileText, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentsTableProps {
  documents: AppDocument[];
  isAdmin?: boolean;
}

export function DocumentsTable({ documents, isAdmin = false }: DocumentsTableProps) {
  async function handleDownload(doc: AppDocument) {
    await incrementDownloadCount(doc.id);
    const link = document.createElement('a');
    link.href = doc.file_url;
    link.target = '_blank';
    link.download = doc.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${doc.title}`);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const res = await deleteDocument(id);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Document Title</TableHead>
          <TableHead>File Size</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Downloads</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No documents available for download.
            </TableCell>
          </TableRow>
        ) : (
          documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs text-foreground">{doc.title}</p>
                    {doc.description && (
                      <p className="text-[11px] text-muted-foreground">{doc.description}</p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs">{formatBytes(doc.file_size)}</TableCell>
              <TableCell>
                <Badge variant="outline">{doc.visibility}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{doc.download_count}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleDownload(doc)}>
                    <Download className="w-3.5 h-3.5 mr-1 text-blue-600" /> Download
                  </Button>
                  {isAdmin && (
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
