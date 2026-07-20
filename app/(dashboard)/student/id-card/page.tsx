'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { generateIDCardsPDF } from '@/lib/export-utils';
import { CreditCard, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentIDCardPage() {
  const [loading, setLoading] = useState(false);

  // Sample student object for preview
  const sampleStudent = {
    id: 's1',
    uid: 'ATM2026-001',
    name: 'Aarav Sharma',
    gender: 'MALE' as any,
    category: 'JUNIOR' as any,
    team_id: 't1',
    team: {
      id: 't1',
      name: 'Ruby Royals',
      code: 'RUBY',
      color: '#EF4444',
      total_points: 120,
      created_at: '',
      updated_at: '',
    },
    created_at: '',
    updated_at: '',
  };

  async function handleDownload(cardsPerPage: 3 | 4) {
    setLoading(true);
    try {
      await generateIDCardsPDF([sampleStudent], cardsPerPage);
      toast.success(`Generated ${cardsPerPage} cards per A4 sheet PDF`);
    } catch (err: any) {
      toast.error('Failed to generate ID card PDF');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Printable Delegate ID Card</h1>
        <p className="text-xs text-muted-foreground">
          Download high-density PDF delegate badges with QR code verification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Card */}
        <Card className="overflow-hidden border-2 border-blue-600">
          <div className="bg-blue-900 text-white p-4 text-center">
            <h3 className="font-extrabold text-sm tracking-wide">AKMM COLLEGE TALENTS MEET 2026</h3>
            <p className="text-[10px] text-blue-200">OFFICIAL DELEGATE BADGE</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-red-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                001
              </div>

              <div>
                <h4 className="font-extrabold text-base text-foreground">Aarav Sharma</h4>
                <p className="font-mono text-xs text-blue-600 font-bold">UID: ATM2026-001</p>
                <p className="text-xs text-muted-foreground">Category: Junior • Gender: Male</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <span className="font-bold text-red-600">Ruby Royals (RUBY)</span>
              <span className="font-mono text-[10px] text-muted-foreground">QR Verification Active</span>
            </div>
          </div>
        </Card>

        {/* Download Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Printer className="w-5 h-5 text-blue-600" /> A4 Layout Print Options
            </CardTitle>
            <CardDescription>Select preferred grid layout for standard A4 paper printing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full justify-start h-12 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
              onClick={() => handleDownload(3)}
            >
              <FileText className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-bold text-sm">3 Cards per A4 Sheet</div>
                <div className="text-[10px] text-blue-100">Recommended for larger badges</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-12"
              disabled={loading}
              onClick={() => handleDownload(4)}
            >
              <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
              <div className="text-left">
                <div className="font-bold text-sm">4 Cards per A4 Sheet</div>
                <div className="text-[10px] text-muted-foreground">Compact wallet size badges</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
