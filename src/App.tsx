import React, { useState } from 'react';
import { CareerProvider, useCareer } from './context/CareerContext';
import { Sidebar, PageId } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardPage } from './components/pages/DashboardPage';
import { CareerPage } from './components/pages/CareerPage';
import { SquadPage } from './components/pages/SquadPage';
import { TacticsPage } from './components/pages/TacticsPage';
import { ScoutingPage } from './components/pages/ScoutingPage';
import { PlayerProPage } from './components/pages/PlayerProPage';
import { MatchesPage } from './components/pages/MatchesPage';
import { PlayersPage } from './components/pages/PlayersPage';
import { TransfersPage } from './components/pages/TransfersPage';
import { TrophiesPage } from './components/pages/TrophiesPage';
import { AwardsPage } from './components/pages/AwardsPage';
import { RecordsPage } from './components/pages/RecordsPage';
import { StatisticsPage } from './components/pages/StatisticsPage';
import { JournalPage } from './components/pages/JournalPage';

// Standard Modals
import { CareerModal } from './components/modals/CareerModal';
import { MatchModal } from './components/modals/MatchModal';
import { PlayerModal } from './components/modals/PlayerModal';
import { TransferModal } from './components/modals/TransferModal';
import { TrophyModal } from './components/modals/TrophyModal';
import { AwardModal } from './components/modals/AwardModal';
import { RecordModal } from './components/modals/RecordModal';
import { JournalModal } from './components/modals/JournalModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { SeasonModal } from './components/modals/SeasonModal';
import { PlayerDetailModal } from './components/modals/PlayerDetailModal';
import { MatchDetailModal } from './components/modals/MatchDetailModal';

// Next-Gen Interactive EA FC Feature Modals
import { FifaCardModal } from './components/modals/FifaCardModal';
import { LiveMatchSimModal } from './components/modals/LiveMatchSimModal';
import { PressConferenceModal } from './components/modals/PressConferenceModal';
import { ScoutNetworkModal } from './components/modals/ScoutNetworkModal';

import { Match, Player, Transfer, Trophy, Award, RecordItem, JournalEntry, Career } from './types';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeCareer, toast } = useCareer();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [careerToEdit, setCareerToEdit] = useState<Career | null>(null);

  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchToEdit, setMatchToEdit] = useState<Match | null>(null);

  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferToEdit, setTransferToEdit] = useState<Transfer | null>(null);

  const [trophyModalOpen, setTrophyModalOpen] = useState(false);
  const [trophyToEdit, setTrophyToEdit] = useState<Trophy | null>(null);

  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [awardToEdit, setAwardToEdit] = useState<Award | null>(null);

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<RecordItem | null>(null);

  const [journalModalOpen, setJournalModalOpen] = useState(false);
  const [journalToEdit, setJournalToEdit] = useState<JournalEntry | null>(null);

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [seasonModalOpen, setSeasonModalOpen] = useState(false);

  // Inspection Modals
  const [inspectedPlayer, setInspectedPlayer] = useState<Player | null>(null);
  const [inspectedMatch, setInspectedMatch] = useState<Match | null>(null);

  // EA FC Special Feature Modals
  const [fifaCardOpen, setFifaCardOpen] = useState(false);
  const [fifaCardPlayer, setFifaCardPlayer] = useState<Player | null>(null);
  const [liveSimOpen, setLiveSimOpen] = useState(false);
  const [pressModalOpen, setPressModalOpen] = useState(false);
  const [scoutModalOpen, setScoutModalOpen] = useState(false);

  // Handler for Quick Add
  const handleQuickAdd = (
    type: 'match' | 'player' | 'transfer' | 'trophy' | 'award' | 'record' | 'journal'
  ) => {
    switch (type) {
      case 'match':
        setMatchToEdit(null);
        setMatchModalOpen(true);
        break;
      case 'player':
        setPlayerToEdit(null);
        setPlayerModalOpen(true);
        break;
      case 'transfer':
        setTransferToEdit(null);
        setTransferModalOpen(true);
        break;
      case 'trophy':
        setTrophyToEdit(null);
        setTrophyModalOpen(true);
        break;
      case 'award':
        setAwardToEdit(null);
        setAwardModalOpen(true);
        break;
      case 'record':
        setRecordToEdit(null);
        setRecordModalOpen(true);
        break;
      case 'journal':
        setJournalToEdit(null);
        setJournalModalOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col antialiased selection:bg-[#ccff00] selection:text-neutral-950 font-sans relative overflow-x-hidden ea-fc-triangles">
      {/* Background Volumetric Stadium Glow Beams */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-[#ccff00]/[0.035] rounded-full blur-[140px] pointer-events-none -translate-y-1/2 -z-10" />
      <div className="fixed top-20 right-10 w-[500px] h-[400px] bg-[#05f1cd]/[0.03] rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[350px] bg-[#0284c7]/[0.025] rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0f1d]/95 border border-[#1e293b] shadow-[0_10px_35px_rgba(0,0,0,0.8)] rounded-2xl text-xs font-semibold backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />}
          {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
          <span className="text-white">{toast.message}</span>
        </div>
      )}

      <div className="flex-1 flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenNewCareer={() => {
            setCareerToEdit(null);
            setCareerModalOpen(true);
          }}
          onOpenSettings={() => setSettingsModalOpen(true)}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            currentPage={currentPage}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onQuickAdd={handleQuickAdd}
            onOpenNewSeason={() => setSeasonModalOpen(true)}
            onOpenLiveSim={() => setLiveSimOpen(true)}
            onOpenPressRoom={() => setPressModalOpen(true)}
            onOpenScouting={() => setScoutModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {currentPage === 'dashboard' && (
              <DashboardPage
                onNavigate={setCurrentPage}
                onOpenMatchModal={() => {
                  setMatchToEdit(null);
                  setMatchModalOpen(true);
                }}
                onViewMatch={(m) => setInspectedMatch(m)}
                onViewPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {currentPage === 'career' && (
              <CareerPage
                onOpenEditCareer={() => {
                  setCareerToEdit(activeCareer || null);
                  setCareerModalOpen(true);
                }}
                onOpenNewSeasonModal={() => setSeasonModalOpen(true)}
              />
            )}

            {currentPage === 'squad' && (
              <SquadPage
                onOpenPlayerModal={() => {
                  setPlayerToEdit(null);
                  setPlayerModalOpen(true);
                }}
                onEditPlayer={(p) => {
                  setPlayerToEdit(p);
                  setPlayerModalOpen(true);
                }}
                onViewPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {currentPage === 'tactics' && <TacticsPage />}

            {currentPage === 'scouting' && (
              <ScoutingPage onOpenScoutNetwork={() => setScoutModalOpen(true)} />
            )}

            {currentPage === 'player-pro' && <PlayerProPage />}

            {currentPage === 'matches' && (
              <MatchesPage
                onOpenMatchModal={() => {
                  setMatchToEdit(null);
                  setMatchModalOpen(true);
                }}
                onEditMatch={(m) => {
                  setMatchToEdit(m);
                  setMatchModalOpen(true);
                }}
                onViewMatch={(m) => setInspectedMatch(m)}
              />
            )}

            {currentPage === 'players' && (
              <PlayersPage
                onOpenPlayerModal={() => {
                  setPlayerToEdit(null);
                  setPlayerModalOpen(true);
                }}
                onEditPlayer={(p) => {
                  setPlayerToEdit(p);
                  setPlayerModalOpen(true);
                }}
                onViewPlayer={(p) => setInspectedPlayer(p)}
              />
            )}

            {currentPage === 'transfers' && (
              <TransfersPage
                onOpenTransferModal={() => {
                  setTransferToEdit(null);
                  setTransferModalOpen(true);
                }}
                onEditTransfer={(t) => {
                  setTransferToEdit(t);
                  setTransferModalOpen(true);
                }}
              />
            )}

            {currentPage === 'trophies' && (
              <TrophiesPage
                onOpenTrophyModal={() => {
                  setTrophyToEdit(null);
                  setTrophyModalOpen(true);
                }}
                onEditTrophy={(tr) => {
                  setTrophyToEdit(tr);
                  setTrophyModalOpen(true);
                }}
              />
            )}

            {currentPage === 'awards' && (
              <AwardsPage
                onOpenAwardModal={() => {
                  setAwardToEdit(null);
                  setAwardModalOpen(true);
                }}
                onEditAward={(aw) => {
                  setAwardToEdit(aw);
                  setAwardModalOpen(true);
                }}
              />
            )}

            {currentPage === 'records' && (
              <RecordsPage
                onOpenRecordModal={() => {
                  setRecordModalOpen(true);
                  setRecordToEdit(null);
                }}
                onEditRecord={(rec) => {
                  setRecordToEdit(rec);
                  setRecordModalOpen(true);
                }}
              />
            )}

            {currentPage === 'statistics' && <StatisticsPage />}

            {currentPage === 'journal' && (
              <JournalPage
                onOpenJournalModal={() => {
                  setJournalToEdit(null);
                  setJournalModalOpen(true);
                }}
                onEditJournal={(j) => {
                  setJournalToEdit(j);
                  setJournalModalOpen(true);
                }}
              />
            )}
          </main>
        </div>
      </div>

      {/* ALL MODAL OVERLAYS */}
      <CareerModal
        isOpen={careerModalOpen}
        onClose={() => {
          setCareerModalOpen(false);
          setCareerToEdit(null);
        }}
        careerToEdit={careerToEdit}
      />

      <MatchModal
        isOpen={matchModalOpen}
        onClose={() => {
          setMatchModalOpen(false);
          setMatchToEdit(null);
        }}
        matchToEdit={matchToEdit}
      />

      <PlayerModal
        isOpen={playerModalOpen}
        onClose={() => {
          setPlayerModalOpen(false);
          setPlayerToEdit(null);
        }}
        playerToEdit={playerToEdit}
      />

      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => {
          setTransferModalOpen(false);
          setTransferToEdit(null);
        }}
        transferToEdit={transferToEdit}
      />

      <TrophyModal
        isOpen={trophyModalOpen}
        onClose={() => {
          setTrophyModalOpen(false);
          setTrophyToEdit(null);
        }}
        trophyToEdit={trophyToEdit}
      />

      <AwardModal
        isOpen={awardModalOpen}
        onClose={() => {
          setAwardModalOpen(false);
          setAwardToEdit(null);
        }}
        awardToEdit={awardToEdit}
      />

      <RecordModal
        isOpen={recordModalOpen}
        onClose={() => {
          setRecordModalOpen(false);
          setRecordToEdit(null);
        }}
        recordToEdit={recordToEdit}
      />

      <JournalModal
        isOpen={journalModalOpen}
        onClose={() => {
          setJournalModalOpen(false);
          setJournalToEdit(null);
        }}
        entryToEdit={journalToEdit}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <SeasonModal
        isOpen={seasonModalOpen}
        onClose={() => setSeasonModalOpen(false)}
      />

      <PlayerDetailModal
        player={inspectedPlayer}
        onClose={() => setInspectedPlayer(null)}
        onEdit={(p) => {
          setPlayerToEdit(p);
          setPlayerModalOpen(true);
        }}
        onOpenCardModal={(p) => {
          setFifaCardPlayer(p);
          setFifaCardOpen(true);
        }}
      />

      <MatchDetailModal
        match={inspectedMatch}
        onClose={() => setInspectedMatch(null)}
        onEdit={(m) => {
          setMatchToEdit(m);
          setMatchModalOpen(true);
        }}
      />

      {/* SPECIAL FEATURE MODALS */}
      <FifaCardModal
        isOpen={fifaCardOpen}
        onClose={() => {
          setFifaCardOpen(false);
          setFifaCardPlayer(null);
        }}
        initialPlayer={fifaCardPlayer}
      />

      <LiveMatchSimModal
        isOpen={liveSimOpen}
        onClose={() => setLiveSimOpen(false)}
      />

      <PressConferenceModal
        isOpen={pressModalOpen}
        onClose={() => setPressModalOpen(false)}
      />

      <ScoutNetworkModal
        isOpen={scoutModalOpen}
        onClose={() => setScoutModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CareerProvider>
      <AppContent />
    </CareerProvider>
  );
}
