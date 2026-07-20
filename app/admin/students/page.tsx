'use client';

import { useState, useEffect } from 'react';
import { Student, Team } from '@/types';
import { getStudents, deleteStudent } from '@/actions/student-actions';
import { getTeams } from '@/actions/team-actions';
import { StudentsTable } from '@/components/tables/students-table';
import { StudentForm } from '@/components/forms/student-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [stData, tmData] = await Promise.all([getStudents(), getTeams()]);
    setStudents(stData);
    setTeams(tmData);
  }

  function handleEdit(student: Student) {
    setSelectedStudent(student);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this student record?')) return;
    const res = await deleteStudent(id);
    if (res.success) {
      toast.success(res.message);
      loadData();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Students Directory</h1>
        <p className="text-xs text-muted-foreground">
          Manage delegate roster, upload photos, bulk import/export Excel, and generate PDF ID cards.
        </p>
      </div>

      <StudentsTable
        initialStudents={students}
        teams={teams}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddClick={() => {
          setSelectedStudent(undefined);
          setModalOpen(true);
        }}
      />

      {/* Student Form Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedStudent ? 'Edit Student Record' : 'Register New Student'}</DialogTitle>
            </DialogHeader>
            <StudentForm
              student={selectedStudent}
              teams={teams}
              onSuccess={() => {
                setModalOpen(false);
                loadData();
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
