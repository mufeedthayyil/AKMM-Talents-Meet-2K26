'use client';

import { useState, useEffect } from 'react';
import { Team } from '@/types';
import { getTeams, updateTeam } from '@/actions/team-actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Trophy, Edit3, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    const data = await getTeams();
    setTeams(data);
  }

  async function handleSaveTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTeam) return;

    const res = await updateTeam(editingTeam.id, {
      name: editingTeam.name,
      color: editingTeam.color,
      logo_url: editingTeam.logo_url,
    });

    if (res.success) {
      toast.success(res.message);
      setEditingTeam(null);
      loadTeams();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Teams Management</h1>
        <p className="text-xs text-muted-foreground">
          View house team standings, configure color codes, and edit team names. (Fixed 4 Teams)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="relative overflow-hidden border-2" style={{ borderColor: team.color }}>
            <div className="h-2 w-full" style={{ backgroundColor: team.color }} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm"
                  style={{ backgroundColor: team.color }}
                >
                  {team.code}
                </div>
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription className="font-mono text-xs">ID: {team.code}</CardDescription>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black flex items-center gap-1 justify-end">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {team.total_points}
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Total Points</p>
              </div>
            </CardHeader>

            <CardContent className="pt-4 border-t border-border">
              {editingTeam?.id === team.id ? (
                <form onSubmit={handleSaveTeam} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase">Team Name</label>
                    <Input
                      value={editingTeam.name}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase">Color Hex Code</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={editingTeam.color}
                        onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={editingTeam.color}
                        onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingTeam(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" size="sm">
                      <Save className="w-3.5 h-3.5 mr-1" /> Save
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Color: <span className="font-mono font-bold" style={{ color: team.color }}>{team.color}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingTeam(team)}>
                    <Edit3 className="w-4 h-4 mr-1 text-muted-foreground" /> Edit
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
