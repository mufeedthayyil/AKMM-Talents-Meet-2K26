'use client';

import { useState, useEffect } from 'react';
import { Appeal, Programme, Team } from '@/types';
import { getAppeals } from '@/actions/appeal-actions';
import { getProgrammes } from '@/actions/programme-actions';
import { getTeams } from '@/actions/team-actions';
import { AppealForm } from '@/components/forms/appeal-form';
import { AppealsTable } from '@/components/tables/appeals-table';

export default function LeaderAppealsPage() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [team, setTeam] = useState<Team | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const teams = await getTeams();
    const myTeam = teams[0];
    setTeam(myTeam);

    const [ap, pr] = await Promise.all([
      getAppeals(myTeam?.id),
      getProgrammes(),
    ]);

    setAppeals(ap);
    setProgrammes(pr);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Official Team Score Appeals</h1>
        <p className="text-xs text-muted-foreground">
          Submit score dispute appeals to the central admin panel and track resolution history.
        </p>
      </div>

      {team && (
        <AppealForm
          programmes={programmes}
          team={team}
          userId="leader-id"
          onSuccess={loadData}
        />
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-sm text-foreground">Submitted Appeals History</h3>
        <AppealsTable appeals={appeals} isAdmin={false} />
      </div>
    </div>
  );
}
