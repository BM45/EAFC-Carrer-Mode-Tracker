import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { sound } from '../../utils/soundEffects';
import {
  X,
  Compass,
  Search,
  Sparkles,
  UserPlus,
  DollarSign,
  Star,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Shield,
} from 'lucide-react';

interface ScoutNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScoutTarget {
  name: string;
  age: number;
  position: string;
  club: string;
  nationality: string;
  overall: number;
  potential: number;
  value: number;
  wage: number;
  signaturePlaystyle?: string;
  pros: string[];
  comparison: string;
}

export const ScoutNetworkModal: React.FC<ScoutNetworkModalProps> = ({ isOpen, onClose }) => {
  const { activeCareer, addPlayer, addTransfer, formatCurrency, selectedSeason } = useCareer();

  const [region, setRegion] = useState('South America');
  const [position, setPosition] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [targets, setTargets] = useState<ScoutTarget[]>([]);
  const [scoutNotes, setScoutNotes] = useState('');
  const [signedIds, setSignedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleRunScoutMission = async () => {
    setLoading(true);
    sound.playClick();
    try {
      const res = await fetch('/api/ai/scout-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: position === 'ALL' ? undefined : position,
          country: region,
          budget: activeCareer?.transferBudget,
        }),
      });
      const data = await res.json();
      setTargets(data.targets || []);
      setScoutNotes(data.scoutNotes || 'Scouts returned with high-potential targets.');
      sound.playFanfare();
    } catch (err) {
      console.error('Failed to run scout mission:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignPlayer = (target: ScoutTarget) => {
    if (!activeCareer) return;

    sound.playCashRegister();

    // 1. Add to squad
    addPlayer({
      name: target.name,
      number: Math.floor(Math.random() * 30) + 12,
      position: target.position as any,
      age: target.age,
      nationality: target.nationality,
      overall: target.overall,
      potential: target.potential,
      growth: 0,
      value: target.value,
      wage: target.wage,
      contractExpiry: '2029',
      role: target.overall >= 80 ? 'Important' : 'Prospect',
      status: 'Fit',
      lineupStatus: 'bench',
      appearances: 0,
      goals: 0,
      assists: 0,
      avgRating: 7.0,
      cleanSheets: 0,
      yellowCards: 0,
      redCards: 0,
    });

    // 2. Log transfer deal
    addTransfer({
      player: target.name,
      type: 'IN',
      fromClub: target.club,
      toClub: activeCareer.club,
      fee: target.value,
      wage: target.wage,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      season: selectedSeason === 'all' ? activeCareer.currentSeason : selectedSeason,
      notes: `Wonderkid scouting network signing from ${target.club}. ${target.comparison}.`,
    });

    setSignedIds((prev) => [...prev, target.name]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                  Global Scouting Network
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  Wonderkid Radar
                </span>
              </div>
              <h3 className="text-xl font-black font-display text-white">
                Scouting Department Hub
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mission Setup Bar */}
        <div className="p-5 bg-neutral-950 border-b border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
              Scouting Territory
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-semibold focus:outline-none"
            >
              <option value="South America">South America (Brazil & Argentina)</option>
              <option value="Western Europe">Western Europe (Spain, France, England, Germany)</option>
              <option value="Southern Europe">Southern Europe (Portugal & Italy)</option>
              <option value="Africa">Africa (Nigeria, Senegal, Ghana)</option>
              <option value="Asia">Asia (Japan & South Korea)</option>
              <option value="Eastern Europe">Eastern Europe (Croatia & Serbia)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
              Target Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white font-semibold focus:outline-none"
            >
              <option value="ALL">Any Position (Best Available)</option>
              <option value="ST">Striker & Center Forward</option>
              <option value="LW">Wingers (LW / RW)</option>
              <option value="CAM">Playmaker (CAM / CM)</option>
              <option value="CDM">Defensive Midfielder (CDM)</option>
              <option value="CB">Center Back (CB)</option>
              <option value="LB">Full Backs (LB / RB)</option>
              <option value="GK">Goalkeeper (GK)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleRunScoutMission}
              disabled={loading}
              className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? 'Analyzing Scout Feeds...' : 'Dispatch Scouts'}</span>
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {targets.length === 0 && !loading && (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <Compass className="w-12 h-12 text-cyan-400/40 mx-auto" />
              <h4 className="text-base font-bold text-white">No Active Scout Dossier</h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Select a territory and target profile above, then click "Dispatch Scouts" to reveal high-potential wonderkids.
              </p>
            </div>
          )}

          {targets.map((t, idx) => {
            const isSigned = signedIds.includes(t.name);

            return (
              <div
                key={idx}
                className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 hover:border-cyan-500/40 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    {/* FIFA Card Preview Tile */}
                    <div className="w-12 h-16 rounded-xl bg-gradient-to-b from-cyan-400/20 to-neutral-900 border border-cyan-400/40 flex flex-col items-center justify-center p-1 text-center">
                      <span className="text-lg font-black font-display text-white leading-none">
                        {t.overall}
                      </span>
                      <span className="text-[9px] font-bold text-cyan-300 uppercase mt-0.5">
                        {t.position}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{t.name}</h4>
                        <span className="text-xs font-semibold text-neutral-400">
                          (Age {t.age})
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        {t.club} • {t.nationality}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                        Potential Ceiling
                      </span>
                      <span className="text-lg font-black font-display text-emerald-400">
                        {t.potential} POT
                      </span>
                    </div>

                    {isSigned ? (
                      <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Signed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSignPlayer(t)}
                        className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Sign ({formatCurrency(t.value)})</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Traits & Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-neutral-300">
                    <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                      Signature PlayStyle
                    </span>
                    <span className="font-semibold text-cyan-300">
                      ⚡ {t.signaturePlaystyle || 'Rapid+'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-neutral-300">
                    <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-0.5">
                      Scout Verdict & Profile
                    </span>
                    <span className="font-medium text-white italic">
                      "{t.comparison}"
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            Available Transfer Budget: <strong className="text-emerald-400">{formatCurrency(activeCareer?.transferBudget ?? 0)}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
