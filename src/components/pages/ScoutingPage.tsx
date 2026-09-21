import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { sound } from '../../utils/soundEffects';
import { getClubDetails, getPlayerPhoto } from '../../utils/assets';
import {
  Compass,
  Search,
  Sparkles,
  UserPlus,
  Star,
  MapPin,
  TrendingUp,
  Shield,
  Briefcase,
  Layers,
  CheckCircle2,
} from 'lucide-react';

interface ScoutingPageProps {
  onOpenCardModal?: (player: any) => void;
  onOpenScoutNetwork?: () => void;
}

export const ScoutingPage: React.FC<ScoutingPageProps> = ({ onOpenCardModal, onOpenScoutNetwork }) => {
  const { activeCareer, addPlayer, addTransfer, formatCurrency, selectedSeason } = useCareer();

  const [region, setRegion] = useState('South America');
  const [position, setPosition] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [signedNames, setSignedNames] = useState<string[]>([]);
  const [targets, setTargets] = useState<any[]>([
    {
      name: 'Franco Mastantuono',
      age: 18,
      position: 'CAM',
      club: 'River Plate',
      nationality: 'Argentina',
      overall: 76,
      potential: 91,
      value: 16500000,
      wage: 15000,
      signaturePlaystyle: 'Dead Ball+ & Incisive Pass',
      comparison: 'Echoes of Paulo Dybala with raw agility',
    },
    {
      name: 'Guillaume Restes',
      age: 20,
      position: 'GK',
      club: 'Toulouse FC',
      nationality: 'France',
      overall: 78,
      potential: 89,
      value: 22000000,
      wage: 24000,
      signaturePlaystyle: 'Footwork+ & Far Throw',
      comparison: 'The modern French successor to Hugo Lloris',
    },
    {
      name: 'Antonio Nusa',
      age: 20,
      position: 'LW',
      club: 'RB Leipzig',
      nationality: 'Norway',
      overall: 77,
      potential: 88,
      value: 21000000,
      wage: 28000,
      signaturePlaystyle: 'Trickster+ & Rapid',
      comparison: 'Explosive wing play comparable to young Sadio Mané',
    },
    {
      name: 'Leny Yoro',
      age: 19,
      position: 'CB',
      club: 'Manchester United',
      nationality: 'France',
      overall: 79,
      potential: 90,
      value: 31000000,
      wage: 45000,
      signaturePlaystyle: 'Anticipate+ & Block',
      comparison: 'Supreme poise and recovery pace like prime Varane',
    },
  ]);

  const handleRunMission = async () => {
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
      if (data.targets && data.targets.length > 0) {
        setTargets(data.targets);
        sound.playFanfare();
      }
    } catch (err) {
      console.error('Scouting error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = (t: any) => {
    if (!activeCareer) return;
    sound.playCashRegister();

    addPlayer({
      name: t.name,
      number: Math.floor(Math.random() * 30) + 12,
      position: t.position as any,
      age: t.age,
      nationality: t.nationality,
      overall: t.overall,
      potential: t.potential,
      growth: 0,
      value: t.value,
      wage: t.wage,
      contractExpiry: '2029',
      role: t.overall >= 80 ? 'Important' : 'Prospect',
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

    addTransfer({
      player: t.name,
      type: 'IN',
      fromClub: t.club,
      toClub: activeCareer.club,
      fee: t.value,
      wage: t.wage,
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
      season: selectedSeason === 'all' ? activeCareer.currentSeason : selectedSeason,
      notes: `Scouted wonderkid signed for ${activeCareer.club}`,
    });

    setSignedNames((prev) => [...prev, t.name]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-neutral-900 border border-neutral-800 rounded-3xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                EA FC Scout Network
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                Youth Academy & Wonderkids
              </span>
            </div>
            <h2 className="text-2xl font-black font-display text-white">Global Scouting Radar</h2>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-neutral-400 block">Club Transfer War Chest:</span>
          <span className="text-xl font-black font-display text-emerald-400">
            {formatCurrency(activeCareer?.transferBudget ?? 0)}
          </span>
        </div>
      </div>

      {/* Scout Dispatch Controls */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
            Global Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-semibold focus:outline-none"
          >
            <option value="South America">South America (Brazil, Argentina, Colombia)</option>
            <option value="Western Europe">Western Europe (Spain, France, England, Germany)</option>
            <option value="Southern Europe">Southern Europe (Portugal & Italy)</option>
            <option value="Africa">Africa (Nigeria, Senegal, Ghana, Ivory Coast)</option>
            <option value="Asia">Asia (Japan & South Korea)</option>
            <option value="Eastern Europe">Eastern Europe (Croatia, Serbia, Poland)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
            Position Focus
          </label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-semibold focus:outline-none"
          >
            <option value="ALL">Any Position (Best High-Ceiling Gems)</option>
            <option value="ST">Center Forward / Striker (ST/CF)</option>
            <option value="LW">Wide Attackers (LW / RW)</option>
            <option value="CAM">Playmaker (CAM / CM)</option>
            <option value="CDM">Defensive Midfielder (CDM)</option>
            <option value="CB">Center Back (CB)</option>
            <option value="GK">Goalkeeper (GK)</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleRunMission}
            disabled={loading}
            className="w-full py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-neutral-950 font-bold rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{loading ? 'Analyzing Scout Networks...' : 'Send Chief Scout'}</span>
          </button>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((t, idx) => {
          const isSigned = signedNames.includes(t.name);
          const targetClub = getClubDetails(t.club);
          const targetPhoto = getPlayerPhoto(t.name);

          return (
            <div
              key={idx}
              className="p-5 bg-neutral-900 rounded-3xl border border-neutral-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-18 rounded-2xl bg-gradient-to-b from-cyan-400/20 to-neutral-950 border border-cyan-400/40 flex flex-col items-center justify-between p-1.5 text-center shadow-md shrink-0">
                    <span className="text-xl font-black font-display text-white leading-none">
                      {t.overall}
                    </span>
                    {targetPhoto ? (
                      <div className="w-7 h-7 rounded-lg overflow-hidden my-0.5 border border-white/10">
                        <img
                          src={targetPhoto}
                          alt={t.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : null}
                    <span className="text-[10px] font-bold text-cyan-300 uppercase leading-none">
                      {t.position}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black font-display text-white">{t.name}</h3>
                      {targetClub.logo && (
                        <img
                          src={targetClub.logo}
                          alt={t.club}
                          referrerPolicy="no-referrer"
                          className="w-4 h-4 object-contain drop-shadow"
                        />
                      )}
                    </div>
                    <p className="text-xs text-neutral-400">
                      {t.club} • {t.nationality} • Age {t.age}
                    </p>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 mt-1">
                      <span>⚡ {t.signaturePlaystyle}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                    Potential
                  </span>
                  <span className="text-xl font-black font-display text-emerald-400">
                    {t.potential} POT
                  </span>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800/80 text-xs italic text-neutral-300">
                "{t.comparison}"
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs font-semibold">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Market Valuation:</span>
                  <span className="text-white font-mono font-bold">{formatCurrency(t.value)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenCardModal?.(t)}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 rounded-xl transition text-xs font-bold"
                  >
                    View FUT Card
                  </button>

                  {isSigned ? (
                    <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Signed
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSign(t)}
                      className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 rounded-xl text-xs font-bold transition shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign to Squad</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
