'use client';

import { useState, useEffect } from 'react';
import { Result, Programme, Student, Team } from '@/types';
import { getResults } from '@/actions/result-actions';
import { getProgrammes } from '@/actions/programme-actions';
import { getStudents } from '@/actions/student-actions';
import { getTeams } from '@/actions/team-actions';
import { ResultForm } from '@/components/forms/result-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateResultsPDF } from '@/lib/export-utils';
import { Trophy, FileText, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function AdminResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [resData, prData, stData, tmData] = await Promise.all([
      getResults(false), // Fetch both draft and published
      getProgrammes(),
      getStudents(),
      getTeams(),
    ]);
    setResults(resData);
    setProgrammes(prData);
    setStudents(stData);
    setTeams(tmData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Results & Winners Publishing</h1>
          <p className="text-xs text-muted-foreground">
            Record winners, publish official standings, and automatically update team leaderboard scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => generateResultsPDF(results)}>
            <FileText className="w-4 h-4 mr-1 text-blue-600" /> Export PDF
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Record New Result
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Programme</TableHead>
            <TableHead>🥇 1st Place</TableHead>
            <TableHead>🥈 2nd Place</TableHead>
            <TableHead>🥉 3rd Place</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No results published yet.
              </TableCell>
            </TableRow>
          ) : (
            results.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-bold text-foreground">
                  {r.programme?.name || 'N/A'} ({r.programme?.code})
                </TableCell>
                <TableCell className="text-xs">
                  {r.first_place_student?.name ? (
                    <span className="font-bold text-amber-600">
                      {r.first_place_student.name} ({r.first_place_team?.name})
                    </span>
                  ) : (
                    '--'
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {r.second_place_student?.name ? (
                    <span className="font-semibold text-slate-600">
                      {r.second_place_student.name} ({r.second_place_team?.name})
                    </span>
                  ) : (
                    '--'
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  {r.third_place_student?.name ? (
                    <span className="font-semibold text-amber-800">
                      {r.third_place_student.name} ({r.third_place_team?.name})
                    </span>
                  ) : (
                    '--'
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={r.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Record Event Result</DialogTitle>
            </DialogHeader>
            <ResultForm
              programmes={programmes}
              students={students}
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
