'use client';

import { Team } from '@/types';
import { Trophy, Award } from 'lucide-react';

interface LeaderboardChartProps {
  teams: Team[];
}

export function LeaderboardChart({ teams }: LeaderboardChartProps) {
  const sortedTeams = [...teams].sort((a, b) => b.total_points - a.total_points);
  const maxPoints = Math.max(...sortedTeams.map((t) => t.total_points), 10);

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Live Championship Leaderboard
          </h3>
          <p className="text-xs text-muted-foreground">Automatic point calculation based on published results</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
          Realtime Active
        </span>
      </div>

      <div className="space-y-5">
        {sortedTeams.map((team, index) => {
          const percentage = Math.round((team.total_points / maxPoints) * 100);
          const rankColors = [
            'from-amber-400 to-amber-600 shadow-amber-500/20 text-amber-950',
            'from-slate-300 to-slate-400 shadow-slate-400/20 text-slate-950',
            'from-amber-700 to-amber-900 shadow-amber-800/20 text-amber-100',
            'from-blue-400 to-blue-600 shadow-blue-500/20 text-blue-950',
          ];

          return (
            <div key={team.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br ${
                      rankColors[index] || rankColors[3]
                    } flex items-center justify-center font-extrabold text-xs shadow-sm`}
                  >
                    #{index + 1}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: team.color }}
                    />
                    <span className="font-bold text-foreground">{team.name}</span>
                    <span className="text-xs font-mono text-muted-foreground">({team.code})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-black text-base">
                  <span>{team.total_points}</span>
                  <span className="text-xs font-normal text-muted-foreground">pts</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-muted/60 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(percentage, 4)}%`,
                    backgroundColor: team.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
