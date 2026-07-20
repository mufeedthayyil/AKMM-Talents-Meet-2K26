'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSetting } from '@/actions/settings-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Save, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getSettings();
    setSettings(data);
  }

  async function handleSaveEventInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const event_info = {
      title: form.get('title') as string,
      college_name: form.get('college_name') as string,
      academic_year: form.get('academic_year') as string,
      venue: form.get('venue') as string,
      start_date: form.get('start_date') as string,
      end_date: form.get('end_date') as string,
    };

    const res = await updateSetting('event_info', event_info);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    setLoading(false);
  }

  const info = settings.event_info || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">System Settings</h1>
        <p className="text-xs text-muted-foreground">
          Configure event details, academic year, and general application properties.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" /> Event & College Configuration
          </CardTitle>
          <CardDescription>These details appear on official reports and printable ID cards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveEventInfo} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">Event Title</label>
              <Input name="title" defaultValue={info.title || 'AKMM Annual Talents Meet 2026'} required />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-muted-foreground">College Name</label>
              <Input name="college_name" defaultValue={info.college_name || 'AKMM College of Excellence'} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Academic Year</label>
                <Input name="academic_year" defaultValue={info.academic_year || '2025-2026'} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Main Venue</label>
                <Input name="venue" defaultValue={info.venue || 'Main Campus Auditorium'} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Start Date</label>
                <Input type="date" name="start_date" defaultValue={info.start_date || '2026-08-10'} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">End Date</label>
                <Input type="date" name="end_date" defaultValue={info.end_date || '2026-08-12'} required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              <Save className="w-4 h-4 mr-2" /> Save System Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
