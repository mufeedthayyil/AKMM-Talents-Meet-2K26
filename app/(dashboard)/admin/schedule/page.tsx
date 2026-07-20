'use client';

import { useState, useEffect } from 'react';
import { Schedule, Programme } from '@/types';
import { getSchedule, upsertSchedule, getProgrammes } from '@/actions/programme-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Plus, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSchedulePage() {
  const [scheduleList, setScheduleList] = useState<Schedule[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [sc, pr] = await Promise.all([getSchedule(), getProgrammes()]);
    setScheduleList(sc);
    setProgrammes(pr);
  }

  async function handleSubmitSchedule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const payload = {
      programme_id: form.get('programme_id') as string,
      venue: form.get('venue') as string,
      event_date: form.get('event_date') as string,
      event_time: form.get('event_time') as string,
      round: (form.get('round') as string) || 'Finals',
      judges: (form.get('judges') as string) || undefined,
    };

    const res = await upsertSchedule(payload);
    if (res.success) {
      toast.success(res.message);
      setModalOpen(false);
      loadData();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Event Schedule & Venues</h1>
          <p className="text-xs text-muted-foreground">
            Schedule event dates, stage venues, time slots, rounds, and judge allocations.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Schedule Event
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Programme</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>Judges</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No events scheduled yet.
              </TableCell>
            </TableRow>
          ) : (
            scheduleList.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold text-foreground">
                  {item.programme?.name || 'N/A'} ({item.programme?.code})
                </TableCell>
                <TableCell className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{item.venue}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{item.event_date} at {item.event_time}</span>
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-xs">{item.round}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.judges || 'TBD'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Schedule Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitSchedule} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Programme</label>
                <select name="programme_id" className="w-full h-10 rounded-lg border bg-background px-3 py-2 text-sm" required>
                  <option value="">-- Choose Programme --</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Venue</label>
                <Input name="venue" placeholder="Main Auditorium Stage A" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Date</label>
                  <Input type="date" name="event_date" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Time</label>
                  <Input type="time" name="event_time" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Round</label>
                <Input name="round" defaultValue="Finals" required />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-muted-foreground">Judges (Optional)</label>
                <Input name="judges" placeholder="Dr. Smith, Prof. Davis" />
              </div>

              <Button type="submit" className="w-full">Save Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
