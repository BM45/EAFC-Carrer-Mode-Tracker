import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { PlayerAttributes } from '../../types';
import { sound } from '../../utils/soundEffects';
import {
  Zap,
  TrendingUp,
  Shield,
  Award,
  Flame,
  Star,
  Globe,
  DollarSign,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  User,
  Heart,
  Target,
  Brain,
  Layers,
  Send,
  Dumbbell,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AVAILABLE_PERKS = [
  { name: 'Finesse Shot+', description: 'Performs finesse shots with curve, extreme precision and speed.' },
  { name: 'Rapid', description: 'Reaches higher sprint speed when dribbling and knocking the ball ahead.' },
  { name: 'First Touch', description: 'Near-zero error trapping the ball and quicker transition into dribbling.' },
  { name: 'Relentless', description: 'Reduces fatigue during play and increases stamina recovery at half time.' },
  { name: 'Trickster', description: 'Grants ability to perform unique flick and skill moves.' },
  { name: 'Power Header', description: 'Performs headers with increased power and precision.' },
  { name: 'Dead Ball', description: 'Set pieces delivered with enhanced speed, curve and targeting guide.' },
  { name: 'Whipped Cross', description: 'Crosses are played with high speed and dip into the box.' },
  { name: 'Anticipate', description: 'Improved success rate when standing tackle and stops attacker clean.' },
];

export const PlayerProPage: React.FC = () => {
  const {
    activeCareer,
    upgradeAttribute,
    addPerk,
    removePerk,
    updateCareer,
    formatCurrency,
    showToast,
  } = useCareer();

  // Personality Points State
  const [maverickPoints, setMaverickPoints] = useState(650);
  const [virtuosoPoints, setVirtuosoPoints] = useState(480);
  const [heartbeatPoints, setHeartbeatPoints] = useState(310);

  // Training Drill state
  const [isTraining, setIsTraining] = useState(false);
  const [lastDrillGrade, setLastDrillGrade] = useState<'A' | 'B' | 'C' | null>(null);

  // Agent Target Club
  const [agentTargetClub, setAgentTargetClub] = useState('Real Madrid');
  const [transferRequestStatus, setTransferRequestStatus] = useState<'none' | 'pending' | 'accepted'>('none');

  if (!activeCareer || activeCareer.mode !== 'player') {
    return (
      <div className="p-12 text-center text-neutral-400">
        Active career is not in Player Mode. Switch to a Player Career from the sidebar.
      </div>
    );
  }

  const attrs: PlayerAttributes = activeCareer.attributes || {
    pace: 85,
    shooting: 82,
    passing: 76,
    dribbling: 84,
    defending: 40,
    physical: 78,
  };

  const devPoints = activeCareer.developmentPoints || 0;
  const equippedPerks = activeCareer.perks || [];

  const handleUpgrade = (key: keyof PlayerAttributes) => {
    if (devPoints < 1) {
      showToast('Need Development Points! Run training drills to earn more.', 'warning');
      return;
    }
    sound.playLevelUp();
    upgradeAttribute(key, 1);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b'],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunTraining = (drillType: string) => {
    setIsTraining(true);
    sound.playClick();

    setTimeout(() => {
      setIsTraining(false);
      const grades: ('A' | 'B' | 'C')[] = ['A', 'A', 'B'];
      const earned = grades[Math.floor(Math.random() * grades.length)];
      setLastDrillGrade(earned);

      const pointsAwarded = earned === 'A' ? 3 : 2;
      updateCareer(activeCareer.id, {
        developmentPoints: devPoints + pointsAwarded,
      });

      sound.playLevelUp();
      showToast(`Training complete: Grade ${earned}! +${pointsAwarded} Development Points added.`, 'success');
    }, 700);
  };

  const handleTransferRequest = () => {
    sound.playClick();
    setTransferRequestStatus('pending');
    setTimeout(() => {
      setTransferRequestStatus('accepted');
      sound.playCashRegister();
      showToast(`Agent reports: ${agentTargetClub} has opened transfer inquiries!`, 'success');
    }, 1200);
  };

  const attributeList: { key: keyof PlayerAttributes; label: string; desc: string }[] = [
    { key: 'pace', label: 'Pace (PAC)', desc: 'Sprint speed & acceleration off the mark' },
    { key: 'shooting', label: 'Shooting (SHO)', desc: 'Finishing, shot power, long shots & volleys' },
    { key: 'passing', label: 'Passing (PAS)', desc: 'Vision, crossing, short & long pass precision' },
    { key: 'dribbling', label: 'Dribbling (DRI)', desc: 'Agility, ball control, balance & reactions' },
    { key: 'defending', label: 'Defending (DEF)', desc: 'Interceptions, defensive awareness & tackling' },
    { key: 'physical', label: 'Physicality (PHY)', desc: 'Jumping, stamina, strength & aggression' },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                {activeCareer.playerName}
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                OVR {activeCareer.playerOverall || 84}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {activeCareer.club} • #{activeCareer.jerseyNumber || 9} • {activeCareer.playerPosition} •{' '}
              {activeCareer.playerArchetype || 'Forward'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Dev Points</span>
            <span className="text-xl font-black font-display text-amber-400">{devPoints} PTS</span>
          </div>

          <button
            type="button"
            onClick={() => handleRunTraining('General')}
            disabled={isTraining}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-neutral-950 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition"
          >
            <Dumbbell className="w-4 h-4" />
            <span>{isTraining ? 'Training...' : 'Quick Training Drill'}</span>
          </button>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT: FIFA CARD + ATTRIBUTES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: THE AUTHENTIC EA FC CARD */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-4">
            OFFICIAL EA FC PLAYER CARD
          </span>

          <div className="w-64 sm:w-72 p-5 rounded-3xl bg-gradient-to-b from-amber-200 via-amber-500 to-amber-900 border-4 border-amber-300 shadow-2xl text-neutral-950 font-display relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black leading-none block">
                  {activeCareer.playerOverall || 84}
                </span>
                <span className="text-base sm:text-lg font-bold uppercase tracking-wider block">
                  {activeCareer.playerPosition}
                </span>
                <span className="text-xs font-semibold text-neutral-800 block mt-0.5">
                  POT: {activeCareer.playerPotential || 92}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-neutral-950/20 text-neutral-900 block">
                  {activeCareer.playerNationality}
                </span>
                <span className="text-xs font-black text-neutral-900 block mt-1">
                  #{activeCareer.jerseyNumber || 9}
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-b border-neutral-950/20 py-3">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950 truncate">
                {activeCareer.playerName}
              </h3>
              <div className="text-xs font-bold text-neutral-900 truncate">
                {activeCareer.club}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-left border-t border-neutral-950/20 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">PAC</span>
                <span className="font-black text-base">{attrs.pace}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">DRI</span>
                <span className="font-black text-base">{attrs.dribbling}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">SHO</span>
                <span className="font-black text-base">{attrs.shooting}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">DEF</span>
                <span className="font-black text-base">{attrs.defending}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">PAS</span>
                <span className="font-black text-base">{attrs.passing}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-neutral-800">PHY</span>
                <span className="font-black text-base">{attrs.physical}</span>
              </div>
            </div>

            <div className="flex items-center justify-around mt-4 pt-2 border-t border-neutral-950/20 text-xs font-bold text-neutral-900">
              <span>Skill: {'★'.repeat(activeCareer.skillMoves || 4)}</span>
              <span>•</span>
              <span>Weak Foot: {'★'.repeat(activeCareer.weakFoot || 4)}</span>
            </div>
          </div>

          <div className="mt-5 w-full grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 block">Preferred Foot</span>
              <span className="font-bold text-white">{activeCareer.preferredFoot || 'Right'}</span>
            </div>
            <div className="p-2.5 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 block">Weekly Wage</span>
              <span className="font-bold text-emerald-400">{formatCurrency(activeCareer.weeklyWage || 45000)}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: ATTRIBUTE DEVELOPMENT TREE */}
        <div className="lg:col-span-2 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Progression</span>
              <h3 className="text-xl font-bold font-display text-white">Attribute Development Tree</h3>
            </div>
            <div className="text-xs text-neutral-400">
              Available Points: <strong className="text-amber-400">{devPoints}</strong>
            </div>
          </div>

          <div className="space-y-3.5">
            {attributeList.map((item) => {
              const val = attrs[item.key];
              const percent = Math.min(100, Math.round((val / 99) * 100));

              return (
                <div
                  key={item.key}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="text-sm font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-neutral-400">{item.desc}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black font-display text-white">{val}</span>
                      <button
                        type="button"
                        onClick={() => handleUpgrade(item.key)}
                        disabled={devPoints < 1 || val >= 99}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          devPoints >= 1 && val < 99
                            ? 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-md shadow-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upgrade</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        val >= 85 ? 'bg-emerald-400' : val >= 75 ? 'bg-amber-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PLAYER PERSONALITY ENGINE (Maverick / Virtuoso / Heartbeat) */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                EA Sports FC Personality
              </span>
              <h3 className="text-lg font-bold font-display text-white">Player Archetype & Personality DNA</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Maverick */}
          <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-400">⚡ Maverick</span>
              <span className="text-xs font-mono font-bold text-white">{maverickPoints} pts</span>
            </div>
            <p className="text-xs text-neutral-400">
              Individualistic brilliance, daring flair, flashy dribbling and lethal finishing in transition.
            </p>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '65%' }} />
            </div>
            <span className="text-[10px] font-bold uppercase text-amber-300 block">
              Tier 3 Perk: +4 Agility & Trickster Boost
            </span>
          </div>

          {/* Virtuoso */}
          <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-blue-400">🎯 Virtuoso</span>
              <span className="text-xs font-mono font-bold text-white">{virtuosoPoints} pts</span>
            </div>
            <p className="text-xs text-neutral-400">
              Cerebral playmaker with ice-cool composure, pin-point passing, and tactical positioning.
            </p>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: '48%' }} />
            </div>
            <span className="text-[10px] font-bold uppercase text-blue-300 block">
              Tier 2 Perk: +3 Vision & Incisive Pass
            </span>
          </div>

          {/* Heartbeat */}
          <div className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400">❤️ Heartbeat</span>
              <span className="text-xs font-mono font-bold text-white">{heartbeatPoints} pts</span>
            </div>
            <p className="text-xs text-neutral-400">
              The engine and soul of the squad. Vocal leader, relentless defensive work rate, and dressing room glue.
            </p>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '31%' }} />
            </div>
            <span className="text-[10px] font-bold uppercase text-emerald-300 block">
              Tier 1 Perk: +2 Stamina & Team Morale Aura
            </span>
          </div>
        </div>
      </div>

      {/* AGENT & DREAM CLUB TARGETS HUB */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-amber-500/30 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Send className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Agent Management
              </span>
              <h3 className="text-lg font-bold font-display text-white">Career Target & Transfer Hub</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={agentTargetClub}
              onChange={(e) => setAgentTargetClub(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white font-bold focus:outline-none"
            >
              <option value="Real Madrid">Real Madrid</option>
              <option value="FC Barcelona">FC Barcelona</option>
              <option value="Manchester City">Manchester City</option>
              <option value="Bayern Munich">Bayern Munich</option>
              <option value="Paris Saint-Germain">Paris Saint-Germain</option>
              <option value="Arsenal">Arsenal</option>
              <option value="Liverpool">Liverpool</option>
            </select>

            <button
              type="button"
              onClick={handleTransferRequest}
              disabled={transferRequestStatus === 'pending'}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-500/20"
            >
              {transferRequestStatus === 'accepted'
                ? 'Offer Inquiry Received ✓'
                : transferRequestStatus === 'pending'
                ? 'Contacting Club...'
                : `Target ${agentTargetClub}`}
            </button>
          </div>
        </div>

        <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80 flex items-center justify-between text-xs">
          <div>
            <span className="text-neutral-400 block">Agent Evaluation:</span>
            <span className="text-white font-semibold">
              Current market value is approx <strong className="text-emerald-400">€75,000,000</strong>. Meeting manager objectives will secure higher wage offers next window.
            </span>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold">
            High Demand
          </span>
        </div>
      </div>

      {/* PLAYSTYLES & PERKS SECTION */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">PlayStyles</span>
              <h3 className="text-lg font-bold font-display text-white">Equipped Signature Perks ({equippedPerks.length}/5)</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {AVAILABLE_PERKS.map((perk) => {
            const isEquipped = equippedPerks.includes(perk.name);
            return (
              <div
                key={perk.name}
                className={`p-4 rounded-2xl border transition ${
                  isEquipped
                    ? 'bg-amber-500/10 border-amber-500/40'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${isEquipped ? 'text-amber-300' : 'text-white'}`}>
                    {perk.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isEquipped) removePerk(perk.name);
                      else addPerk(perk.name);
                    }}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                      isEquipped
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {isEquipped ? 'Equipped ✓' : 'Equip'}
                  </button>
                </div>
                <p className="text-xs text-neutral-400">{perk.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* MANAGER CONFIDENCE & INTERNATIONAL STANDING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manager Trust */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Club Standing</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="text-base font-bold font-display text-white">Manager Confidence</h4>
          <p className="text-xs text-neutral-400">
            Based on your recent match ratings, goal contributions, and completed manager objectives.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="text-3xl font-black font-display text-emerald-400">
              {activeCareer.managerConfidence || 85}%
            </div>
            <div className="flex-1">
              <div className="w-full h-3 rounded-full bg-neutral-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${activeCareer.managerConfidence || 85}%` }}
                />
              </div>
              <span className="text-[11px] text-neutral-300 block mt-1 font-semibold">
                Status: {activeCareer.squadRole || 'Crucial Starter'}
              </span>
            </div>
          </div>
        </div>

        {/* International Duties */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">International Duty</span>
            <Globe className="w-4 h-4 text-blue-400" />
          </div>
          <h4 className="text-base font-bold font-display text-white">
            {activeCareer.nationalTeam || 'National Team'} Selection
          </h4>
          <p className="text-xs text-neutral-400">
            Representing your country in international tournaments and friendlies.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 block">International Caps</span>
              <span className="text-xl font-black font-display text-white">
                {activeCareer.nationalTeamCaps || 6}
              </span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-400 block">National Goals</span>
              <span className="text-xl font-black font-display text-emerald-400">
                {activeCareer.nationalTeamGoals || 4}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
