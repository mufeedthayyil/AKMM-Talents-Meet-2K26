'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getStudents } from '@/actions/student-actions';
import { getProgrammes } from '@/actions/programme-actions';
import { getResults } from '@/actions/result-actions';
import { getTeams } from '@/actions/team-actions';
import {
  generateStudentsPDF,
  generateProgrammesPDF,
  generateResultsPDF,
  generateTeamPointsPDF,
  exportToExcel,
  exportToCSV,
} from '@/lib/export-utils';
import { FileSpreadsheet, FileText, Download, Trophy, Users, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(false);

  async function handleExportStudents(format: 'pdf' | 'excel' | 'csv') {
    setLoading(true);
    const students = await getStudents();
    if (format === 'pdf') {
      generateStudentsPDF(students);
    } else if (format === 'excel') {
      const data = students.map((s) => ({ UID: s.uid, Name: s.name, Gender: s.gender, Category: s.category, Team: s.team?.name }));
      exportToExcel(data, 'student_report');
    } else {
      const data = students.map((s) => ({ UID: s.uid, Name: s.name, Gender: s.gender, Category: s.category, Team: s.team?.name }));
      exportToCSV(data, 'student_report');
    }
    toast.success(`Student report generated in ${format.toUpperCase()} format`);
    setLoading(false);
  }

  async function handleExportProgrammes(format: 'pdf' | 'excel' | 'csv') {
    setLoading(true);
    const programmes = await getProgrammes();
    if (format === 'pdf') {
      generateProgrammesPDF(programmes);
    } else {
      const data = programmes.map((p) => ({ Code: p.code, Name: p.name, Type: p.type, Category: p.category, Points: p.point_category }));
      if (format === 'excel') exportToExcel(data, 'programmes_report');
      else exportToCSV(data, 'programmes_report');
    }
    toast.success(`Programme report generated in ${format.toUpperCase()} format`);
    setLoading(false);
  }

  async function handleExportResults(format: 'pdf' | 'excel' | 'csv') {
    setLoading(true);
    const results = await getResults(true);
    if (format === 'pdf') {
      generateResultsPDF(results);
    } else {
      const data = results.map((r) => ({
        Programme: r.programme?.name,
        Winner: r.first_place_student?.name,
        FirstTeam: r.first_place_team?.name,
        RunnerUp: r.second_place_student?.name,
      }));
      if (format === 'excel') exportToExcel(data, 'results_report');
      else exportToCSV(data, 'results_report');
    }
    toast.success(`Results report generated in ${format.toUpperCase()} format`);
    setLoading(false);
  }

  async function handleExportTeams() {
    setLoading(true);
    const teams = await getTeams();
    generateTeamPointsPDF(teams);
    toast.success('Team leaderboard report generated in PDF');
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Reports & One-Click Export Center</h1>
        <p className="text-xs text-muted-foreground">
          Generate official PDF summaries, Excel datasheets, and CSV exports for college archives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Roster Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Student Delegates Report
            </CardTitle>
            <CardDescription>Complete roster of registered students, teams, and categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleExportStudents('pdf')} disabled={loading}>
              <FileText className="w-4 h-4 mr-1 text-red-500" /> PDF Report
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportStudents('excel')} disabled={loading}>
              <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-600" /> Excel Sheet
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportStudents('csv')} disabled={loading}>
              <Download className="w-4 h-4 mr-1" /> CSV
            </Button>
          </CardContent>
        </Card>

        {/* Programme Schedule Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Programmes Catalog Report
            </CardTitle>
            <CardDescription>List of all stage events, point categories, and participation quotas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleExportProgrammes('pdf')} disabled={loading}>
              <FileText className="w-4 h-4 mr-1 text-red-500" /> PDF Report
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportProgrammes('excel')} disabled={loading}>
              <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-600" /> Excel Sheet
            </Button>
          </CardContent>
        </Card>

        {/* Official Results Report Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Official Results & Winners Sheet
            </CardTitle>
            <CardDescription>Published 1st, 2nd, 3rd winners with awarded team points.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => handleExportResults('pdf')} disabled={loading}>
              <FileText className="w-4 h-4 mr-1 text-red-500" /> PDF Winners Sheet
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleExportResults('excel')} disabled={loading}>
              <FileSpreadsheet className="w-4 h-4 mr-1 text-emerald-600" /> Excel Export
            </Button>
          </CardContent>
        </Card>

        {/* Team Leaderboard Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-600" />
              Team Championship Standings
            </CardTitle>
            <CardDescription>Official leaderboard tally for House Teams.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm" onClick={handleExportTeams} disabled={loading}>
              <FileText className="w-4 h-4 mr-1 text-red-500" /> Generate Leaderboard PDF
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
