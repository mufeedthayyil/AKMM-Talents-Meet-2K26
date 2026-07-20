import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Trophy, Shield, Users, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { getTeams } from '@/actions/team-actions';
import { LeaderboardChart } from '@/components/charts/leaderboard-chart';

export default async function LandingPage() {
  const teams = await getTeams();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Public Header */}
      <header className="h-20 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/30">
            A
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight">ATMMS 2026</h1>
            <p className="text-xs text-muted-foreground font-semibold">AKMM College Talents Meet</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/student-login">
            <Button variant="outline" className="font-semibold border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              <User className="w-4 h-4 mr-2" />
              Student Login
            </Button>
          </Link>
          <Link href="/login">
            <Button className="font-semibold bg-blue-600 hover:bg-blue-700">
              <Shield className="w-4 h-4 mr-2" />
              Staff / Leader Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12 space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Official Talent Meet Portal 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            AKMM Annual <span className="text-blue-600">Talents Meet</span> Management System
          </h1>

          <p className="text-lg text-muted-foreground">
            Complete enterprise platform for student event registrations, team points tracking, live result publishing, and delegate ID cards.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/student-login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-base font-bold shadow-lg shadow-blue-600/20">
                Student UID Login
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base font-bold">
                Admin & Leader Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Leaderboard Standings Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <LeaderboardChart teams={teams} />
          </div>

          {/* Quick Feature Cards */}
          <div className="space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Automatic Point Scoring</h3>
              <p className="text-xs text-muted-foreground">
                Category A (7/5/3) and Category B (20/10/5) team points are updated in real-time as results are published.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Four Official House Teams</h3>
              <p className="text-xs text-muted-foreground">
                Ruby Royals, Sapphire Knights, Emerald Titans, and Diamond Eagles competing for the grand trophy.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base">Printable A4 ID Cards</h3>
              <p className="text-xs text-muted-foreground">
                Generate high-density PDF delegate badges with QR code verification (3 or 4 per A4 sheet).
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-xs text-muted-foreground">
        © 2026 AKMM College of Excellence. All Rights Reserved. Built with Next.js 15 & Supabase.
      </footer>
    </div>
  );
}
