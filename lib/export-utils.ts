import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student, Programme, Result, Team } from '@/types';
import { generateQRCodeDataURL } from './qr-utils';

// ====================================================
// EXCEL EXPORT & IMPORT
// ====================================================

export function exportToExcel(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// ====================================================
// CSV EXPORT
// ====================================================

export function exportToCSV(data: any[], fileName: string) {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ====================================================
// PDF REPORTS GENERATION
// ====================================================

export function generateStudentsPDF(students: Student[], title: string = 'Student Roster Report') {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138); // Blue theme
  doc.text('AKMM TALENTS MEET MANAGEMENT SYSTEM', 14, 20);
  doc.setFontSize(13);
  doc.setTextColor(100);
  doc.text(title, 14, 28);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 34);

  const tableData = students.map((s, index) => [
    index + 1,
    s.uid,
    s.name,
    s.gender,
    s.category,
    s.team?.name || 'N/A',
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['#', 'UID', 'Name', 'Gender', 'Category', 'Team']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}

export function generateProgrammesPDF(programmes: Programme[], title: string = 'Programmes Schedule & Info') {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text('AKMM TALENTS MEET MANAGEMENT SYSTEM', 14, 20);
  doc.setFontSize(13);
  doc.setTextColor(100);
  doc.text(title, 14, 28);

  const tableData = programmes.map((p, index) => [
    index + 1,
    p.code,
    p.name,
    p.type,
    p.category,
    `Cat ${p.point_category}`,
    p.status,
  ]);

  autoTable(doc, {
    startY: 36,
    head: [['#', 'Code', 'Programme Name', 'Type', 'Category', 'Points', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}

export function generateResultsPDF(results: Result[], title: string = 'Official Results Sheet') {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text('AKMM TALENTS MEET MANAGEMENT SYSTEM', 14, 20);
  doc.setFontSize(13);
  doc.setTextColor(100);
  doc.text(title, 14, 28);

  const tableData = results.map((r, index) => [
    index + 1,
    r.programme?.name || 'N/A',
    r.first_place_student?.name ? `${r.first_place_student.name} (${r.first_place_team?.name || ''})` : 'N/A',
    r.second_place_student?.name ? `${r.second_place_student.name} (${r.second_place_team?.name || ''})` : 'N/A',
    r.third_place_student?.name ? `${r.third_place_student.name} (${r.third_place_team?.name || ''})` : 'N/A',
  ]);

  autoTable(doc, {
    startY: 36,
    head: [['#', 'Programme', '1st Place (Winner)', '2nd Place', '3rd Place']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}

export function generateTeamPointsPDF(teams: Team[], title: string = 'Team Points Leaderboard') {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text('AKMM TALENTS MEET MANAGEMENT SYSTEM', 14, 20);
  doc.setFontSize(13);
  doc.setTextColor(100);
  doc.text(title, 14, 28);

  const tableData = teams.map((t, index) => [
    index + 1,
    t.name,
    t.code,
    t.total_points,
  ]);

  autoTable(doc, {
    startY: 36,
    head: [['Rank', 'Team Name', 'Code', 'Total Points']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
  });

  doc.save('team_points_leaderboard.pdf');
}

// ====================================================
// ID CARD PDF GENERATOR (3 per A4 or 4 per A4)
// ====================================================

export async function generateIDCardsPDF(
  students: Student[],
  cardsPerPage: 3 | 4 = 3
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const cardWidth = 160;
  const cardHeight = cardsPerPage === 3 ? 80 : 62;
  const startX = (pageWidth - cardWidth) / 2;
  const marginY = 15;
  const spacingY = cardsPerPage === 3 ? 12 : 8;

  let currentCardOnPage = 0;

  for (let i = 0; i < students.length; i++) {
    if (currentCardOnPage >= cardsPerPage) {
      doc.addPage();
      currentCardOnPage = 0;
    }

    const student = students[i];
    const y = marginY + currentCardOnPage * (cardHeight + spacingY);

    // Outer Card Border
    doc.setLineWidth(0.5);
    doc.setDrawColor(220, 226, 235);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(startX, y, cardWidth, cardHeight, 4, 4, 'FD');

    // Header Banner
    doc.setFillColor(30, 58, 138);
    doc.roundedRect(startX, y, cardWidth, 16, 4, 4, 'F');
    doc.rect(startX, y + 8, cardWidth, 8, 'F');

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('AKMM COLLEGE TALENTS MEET 2026', startX + cardWidth / 2, y + 10, { align: 'center' });

    // Team Accent Color Bar
    const teamColorHex = student.team?.color || '#3B82F6';
    doc.setFillColor(teamColorHex);
    doc.rect(startX, y + 16, cardWidth, 3, 'F');

    // Student Information
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name, startX + 15, y + 27);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`UID: ${student.uid}`, startX + 15, y + 34);
    doc.text(`Category: ${student.category}`, startX + 15, y + 40);
    doc.text(`Gender: ${student.gender}`, startX + 15, y + 46);
    doc.text(`Team: ${student.team?.name || 'Unassigned'}`, startX + 15, y + 52);

    // Verification QR Code
    const qrDataUrl = await generateQRCodeDataURL(`ATMMS-STUDENT:${student.uid}:${student.name}`);
    if (qrDataUrl) {
      doc.addImage(qrDataUrl, 'PNG', startX + cardWidth - 45, y + 24, 32, 32);
      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.text('Scan for Verification', startX + cardWidth - 29, y + 59, { align: 'center' });
    }

    // Card Footer Line
    doc.setDrawColor(241, 245, 249);
    doc.line(startX + 10, y + cardHeight - 10, startX + cardWidth - 10, y + cardHeight - 10);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('OFFICIAL STUDENT DELEGATE BADGE', startX + cardWidth / 2, y + cardHeight - 4, { align: 'center' });

    currentCardOnPage++;
  }

  doc.save(`student_id_cards_${cardsPerPage}_per_page.pdf`);
}
