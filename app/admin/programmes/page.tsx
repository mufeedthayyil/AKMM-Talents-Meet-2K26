'use client';

import { useState, useEffect } from 'react';
import { Programme } from '@/types';
import { getProgrammes } from '@/actions/programme-actions';
import { ProgrammesTable } from '@/components/tables/programmes-table';
import { ProgrammeForm } from '@/components/forms/programme-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminProgrammesPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadProgrammes();
  }, []);

  async function loadProgrammes() {
    const data = await getProgrammes();
    setProgrammes(data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Programmes Catalog</h1>
        <p className="text-xs text-muted-foreground">
          Configure On/Off stage events, Junior/Senior/General categories, and lock registrations.
        </p>
      </div>

      <ProgrammesTable
        initialProgrammes={programmes}
        isAdmin={true}
        onAddClick={() => setModalOpen(true)}
      />

      {/* Programme Form Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event Programme</DialogTitle>
            </DialogHeader>
            <ProgrammeForm
              onSuccess={() => {
                setModalOpen(false);
                loadProgrammes();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
