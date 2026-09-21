import React, { useState, useRef, useEffect } from 'react';
import { useCareer } from '../context/CareerContext';
import { PageId } from './Sidebar';
import { sound } from '../utils/soundEffects';
import { getClubDetails } from '../utils/assets';
import {
  Menu,
  Plus,
  Calendar,
  CalendarDays,
  Users,
  ArrowRightLeft,
  Trophy,
  Award,
  BookOpen,
  Briefcase,
  User,
  Shield,
  Percent,
  Volume2,
  VolumeX,
  Zap,
  Mic,
  Compass,
} from 'lucide-react';

interface TopbarProps {
  currentPage: PageId;
  onOpenMobileMenu: () => void;
  onQuickAdd: (
    type: 'match' | 'player' | 'transfer' | 'trophy' | 'award' | 'record' | 'journal'
  ) => void;
  onOpenNewSeason: () => void;
  onOpenLiveSim?: () => void;
  onOpenPressRoom?: () => void;
  onOpenScouting?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentPage,
  onOpenMobileMenu,
  onQuickAdd,
  onOpenNewSeason,
  onOpenLiveSim,
  onOpenPressRoom,
  onOpenScouting,
}) => {
  const { activeCareer, selectedSeason, setSelectedSeason, formatCurrency } = useCareer();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getIsMuted());
  const quickAddRef = useRef<HTMLDivElement>(null);

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setIsQuickAddOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (page: PageId) => {
    switch (page) {
      case 'dashboard':
        return { eyebrow: 'OVERVIEW', title: 'Dashboard' };
      case 'career':
        return { eyebrow: 'CAREER ARCHIVE', title: 'Career Journey' };
      case 'squad':
        return { eyebrow: 'TEAM & TACTICS', title: 'Squad Lineup' };
      case 'tactics':
        return { eyebrow: 'STRATEGY & CHEM', title: 'Tactics & Chemistry' };
      case 'scouting':
        return { eyebrow: 'GLOBAL NETWORK', title: 'Scouting & Wonderkids' };
      case 'player-pro':
        return { eyebrow: 'PRO PLAYER', title: 'My Pro Player' };
      case 'matches':
        return { eyebrow: 'FIXTURES & RESULTS', title: 'Matches' };
      case 'players':
        return { eyebrow: 'DATABASE', title: activeCareer?.mode === 'player' ? 'Teammates' : 'Players Database' };
      case 'transfers':
        return { eyebrow: 'TRANSFER MARKET', title: 'Transfers & Contracts' };
      case 'trophies':
        return { eyebrow: 'SILVERWARE', title: 'Trophy Cabinet' };
      case 'awards':
        return { eyebrow: 'HONOURS', title: 'Individual Awards' };
      case 'records':
        return { eyebrow: 'HALL OF FAME', title: 'Career Records' };
      case 'statistics':
        return { eyebrow: 'PERFORMANCE', title: 'Analytics & Stats' };
      case 'journal':
        return { eyebrow: 'MEMORIES & PRESS', title: 'Career Journal' };
      default:
        return { eyebrow: 'CAREER', title: 'Career Tracker' };
    }
  };

  const { eyebrow, title } = getPageTitle(currentPage);
  const isPlayerMode = activeCareer?.mode === 'player';

  // Available seasons list
  const availableSeasons = activeCareer
    ? Array.from(new Set([activeCareer.currentSeason, ...activeCareer.seasons.map((s) => s.season)])).filter(Boolean)
    : ['2025/26'];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#070b14]/85 backdrop-blur-xl border-b border-[#1a2333]/90">
      {/* Left: Mobile Button + Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-400 hover:text-white rounded-xl lg:hidden hover:bg-white/[0.04] transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <span className="text-[10px] font-black tracking-widest text-[#ccff00] uppercase drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]">
            {eyebrow}
          </span>
          <h1 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Center/Right: Career Pill & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Career Mode Summary Badge */}
        {activeCareer && (() => {
          const club = getClubDetails(activeCareer.club);
          return (
            <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-[#0c1220]/90 border border-[#1e293b] text-xs shadow-md">
              <div className="flex items-center gap-2">
                {club.logo ? (
                  <img
                    src={club.logo}
                    alt={activeCareer.club}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 object-contain drop-shadow"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-md bg-[#ccff00]/15 text-[#ccff00] font-black text-[9px] flex items-center justify-center border border-[#ccff00]/30">
                    {club.short}
                  </span>
                )}
                {isPlayerMode ? (
                  <>
                    <span className="flex items-center justify-center px-1.5 py-0.5 rounded-md bg-amber-400 text-neutral-950 font-black text-[10px]">
                      {activeCareer.playerOverall || 84}
                    </span>
                    <span className="font-bold text-white truncate max-w-[110px]">
                      {activeCareer.playerName || 'Pro Player'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#141d2f] text-slate-300 font-mono">
                      {activeCareer.playerPosition || 'ST'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-white truncate max-w-[120px]">{activeCareer.club}</span>
                    {activeCareer.transferBudget !== undefined && (
                      <span className="text-[11px] text-[#ccff00] font-bold font-mono">
                        {formatCurrency(activeCareer.transferBudget)}
                      </span>
                    )}
                  </>
                )}
              </div>

              {isPlayerMode && activeCareer.managerConfidence !== undefined && (
                <div className="flex items-center gap-1 pl-2 border-l border-[#1e293b] text-[11px] text-slate-300">
                  <Shield className="w-3 h-3 text-[#ccff00]" />
                  <span>Mgr Trust:</span>
                  <strong className="text-[#ccff00]">{activeCareer.managerConfidence}%</strong>
                </div>
              )}
            </div>
          );
        })()}

        {/* Season Filter Dropdown */}
        <div className="flex items-center gap-1 bg-[#0c1220] border border-[#1e293b] rounded-xl px-2 py-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 hidden sm:block ml-1" />
          <select
            value={selectedSeason}
            onChange={(e) => {
              if (e.target.value === '__add_new__') {
                onOpenNewSeason();
              } else {
                setSelectedSeason(e.target.value);
              }
            }}
            className="bg-transparent text-xs font-semibold text-slate-200 py-1 px-1 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0c1220]">All Seasons</option>
            {availableSeasons.map((s) => (
              <option key={s} value={s} className="bg-[#0c1220]">
                Season {s}
              </option>
            ))}
            <option value="__add_new__" className="bg-[#0c1220] text-[#ccff00]">＋ Start New Season</option>
          </select>
        </div>

        {/* Live Sim Fast Button */}
        {onOpenLiveSim && (
          <button
            type="button"
            onClick={onOpenLiveSim}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#05f1cd]/15 hover:bg-[#05f1cd]/25 border border-[#05f1cd]/40 text-[#05f1cd] font-black text-xs rounded-xl transition shadow-[0_0_15px_rgba(5,241,205,0.2)]"
            title="Live Match Day Simulator"
          >
            <Zap className="w-3.5 h-3.5 text-[#05f1cd]" />
            <span>Live Sim</span>
          </button>
        )}

        {/* Media Press Room Fast Button */}
        {onOpenPressRoom && (
          <button
            type="button"
            onClick={onOpenPressRoom}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold text-xs rounded-xl transition"
            title="AI Press Conference Room"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Press Room</span>
          </button>
        )}

        {/* Audio Sound FX Toggle */}
        <button
          type="button"
          onClick={handleToggleSound}
          className={`p-2 rounded-xl border transition ${
            isMuted
              ? 'bg-[#0c1220] border-[#1e293b] text-slate-500 hover:text-slate-300'
              : 'bg-[#ccff00]/10 border-[#ccff00]/30 text-[#ccff00] hover:bg-[#ccff00]/20'
          }`}
          title={isMuted ? 'Sound FX Muted (Click to enable stadium audio)' : 'Sound FX Active (Click to mute)'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative" ref={quickAddRef}>
          <button
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-black text-[#050811] bg-gradient-to-r from-[#ccff00] to-[#b8e600] hover:brightness-110 rounded-xl transition shadow-[0_0_20px_rgba(204,255,0,0.35)]"
          >
            <Plus className="w-4 h-4 text-[#050811]" />
            <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Quick Add</span>
          </button>

          {isQuickAddOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#0b101c]/95 backdrop-blur-xl border border-[#1e293b] rounded-2xl shadow-2xl p-1.5 z-50 text-xs text-slate-200">
              <button
                onClick={() => {
                  setIsQuickAddOpen(false);
                  onQuickAdd('match');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-[#ccff00] transition"
              >
                <CalendarDays className="w-4 h-4 text-[#ccff00]" />
                <span>Log Match Result</span>
              </button>

              {!isPlayerMode && (
                <button
                  onClick={() => {
                  setIsQuickAddOpen(false);
                  onQuickAdd('player');
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-[#05f1cd] transition"
              >
                <Users className="w-4 h-4 text-[#05f1cd]" />
                <span>Add Squad Player</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsQuickAddOpen(false);
                onQuickAdd('transfer');
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-purple-300 transition"
            >
              <ArrowRightLeft className="w-4 h-4 text-purple-400" />
              <span>Record Transfer</span>
            </button>

            <button
              onClick={() => {
                setIsQuickAddOpen(false);
                onQuickAdd('trophy');
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-amber-300 transition"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Add Won Trophy</span>
            </button>

            <button
              onClick={() => {
                setIsQuickAddOpen(false);
                onQuickAdd('award');
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-amber-200 transition"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Log Award (e.g. Ballon d'Or)</span>
            </button>

            <button
              onClick={() => {
                setIsQuickAddOpen(false);
                onQuickAdd('journal');
              }}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl hover:bg-white/[0.06] hover:text-indigo-300 transition"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>New Storyline / Journal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
  );
};
