import React from 'react';
import { useCareer } from '../context/CareerContext';
import { ASSETS_3D, getClubDetails } from '../utils/assets';
import {
  LayoutDashboard,
  Compass,
  Users,
  UserCheck,
  CalendarDays,
  ArrowRightLeft,
  Trophy,
  Award,
  Flame,
  BarChart3,
  BookOpen,
  Settings,
  Plus,
  Briefcase,
  User,
  CheckCircle2,
  Sliders,
  Radar,
  Sparkles,
  Database,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'fc27-database'
  | 'career'
  | 'squad'
  | 'tactics'
  | 'scouting'
  | 'player-pro'
  | 'matches'
  | 'players'
  | 'transfers'
  | 'trophies'
  | 'awards'
  | 'records'
  | 'statistics'
  | 'journal';

interface SidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  onOpenNewCareer: () => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  onOpenNewCareer,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
}) => {
  const {
    careers,
    activeCareer,
    setActiveCareerId,
    allCareerMatches,
    allCareerPlayers,
    allCareerTransfers,
    allCareerTrophies,
    allCareerAwards,
    records,
    journal,
  } = useCareer();

  const isPlayerMode = activeCareer?.mode === 'player';

  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fc27-database' as PageId, label: 'FC 27 Database', icon: Database, isNew: true },
    { id: 'career' as PageId, label: 'Career Journey', icon: Compass },
    ...(isPlayerMode
      ? [{ id: 'player-pro' as PageId, label: 'My Pro Player', icon: UserCheck }]
      : [
          { id: 'squad' as PageId, label: 'Squad Lineup', icon: Users, count: allCareerPlayers.length },
          { id: 'tactics' as PageId, label: 'Tactics & Chem', icon: Sliders },
          { id: 'scouting' as PageId, label: 'Scout Network', icon: Radar },
        ]),
    { id: 'matches' as PageId, label: 'Matches', icon: CalendarDays, count: allCareerMatches.length },
    { id: 'players' as PageId, label: isPlayerMode ? 'Teammates' : 'Players', icon: Users, count: allCareerPlayers.length },
    { id: 'transfers' as PageId, label: 'Transfers', icon: ArrowRightLeft, count: allCareerTransfers.length },
    { id: 'trophies' as PageId, label: 'Trophy Cabinet', icon: Trophy, count: allCareerTrophies.length },
    { id: 'awards' as PageId, label: 'Awards', icon: Award, count: allCareerAwards.length },
    { id: 'records' as PageId, label: 'Records', icon: Flame, count: records.length },
    { id: 'statistics' as PageId, label: 'Statistics', icon: BarChart3 },
    { id: 'journal' as PageId, label: 'Journal & Stories', icon: BookOpen, count: journal.length },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-[#070b14]/95 backdrop-blur-xl border-r border-[#1a2333]/90 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a2333]/90 bg-gradient-to-r from-[#0c1220] via-[#090e1a] to-[#070b14] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#ccff00]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative group">
            <img
              src={ASSETS_3D.fcBrandLogo}
              alt="EA SPORTS FC 27"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-2xl object-cover border-2 border-[#ccff00]/50 shadow-md shadow-[#ccff00]/20 group-hover:scale-105 transition-transform"
            />
            <div className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#050811] border border-[#ccff00] text-[8px] font-black text-[#ccff00] rounded">
              27
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-wider text-white font-display uppercase leading-none truncate">
                EA SPORTS FC
              </span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#ccff00] text-[#050811] shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                27
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase truncate">
                HyperMotion V6.0
              </span>
            </div>
          </div>
        </div>

        {/* Career Switcher Section */}
        <div className="px-4 py-4 border-b border-[#1a2333]/90 bg-[#090e1a]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Active Career</span>
            <button
              onClick={onOpenNewCareer}
              className="flex items-center gap-1 text-[11px] font-bold text-[#ccff00] hover:text-[#d9ff33] transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="relative">
            <select
              value={activeCareer?.id || ''}
              onChange={(e) => setActiveCareerId(e.target.value)}
              className="w-full px-3 py-2 pr-8 text-xs font-semibold bg-[#0d1424] border border-[#1e293b] rounded-xl text-white appearance-none focus:outline-none focus:border-[#ccff00] truncate"
            >
              {careers.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0c1220] text-white">
                  {c.mode === 'manager' ? '👔' : '⚡'} {c.name} ({c.club})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {activeCareer && (() => {
            const clubDetails = getClubDetails(activeCareer.club);
            return (
              <div className="mt-2.5 p-2 rounded-xl bg-[#060913]/90 border border-[#1e293b]/80 text-[11px] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {clubDetails.logo ? (
                    <img
                      src={clubDetails.logo}
                      alt={activeCareer.club}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 object-contain shrink-0 drop-shadow"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 flex items-center justify-center font-bold text-[9px] shrink-0">
                      {clubDetails.short}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-white block text-xs truncate">
                      {activeCareer.club}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      {activeCareer.mode === 'manager' ? 'Manager Mode' : 'Player Mode'} • {activeCareer.currentSeason}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  onCloseMobile();
                }}
                className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ccff00]/15 via-[#ccff00]/5 to-transparent text-[#ccff00] border-l-2 border-[#ccff00] shadow-[inset_0_0_15px_rgba(204,255,0,0.06)] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#ccff00]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.isNew ? (
                  <span className="px-1.5 py-0.5 rounded bg-[#ccff00] text-[#050811] text-[9px] font-black uppercase tracking-wider shadow-[0_0_8px_rgba(204,255,0,0.3)]">
                    NEW
                  </span>
                ) : item.count !== undefined && item.count > 0 ? (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-[#ccff00] text-[#050811]' : 'bg-[#141d2f] text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-3 border-t border-[#1a2333]/90 bg-[#060a13]/80 space-y-2">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Backup</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ccff00] shrink-0" />
            <span>Saved locally in browser</span>
          </div>
        </div>
      </aside>
    </>
  );
};
