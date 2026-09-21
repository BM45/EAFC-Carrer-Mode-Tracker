import React, { useState } from 'react';
import { Player } from '../../types';
import { sound } from '../../utils/soundEffects';
import { useCareer } from '../../context/CareerContext';
import { ASSETS_3D, getClubDetails, getPlayerPhoto } from '../../utils/assets';
import {
  X,
  Sparkles,
  Download,
  Share2,
  Flame,
  Shield,
  Zap,
  Star,
  Layers,
  Palette,
  Check,
} from 'lucide-react';

interface FifaCardModalProps {
  player?: Player | null;
  initialPlayer?: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export type CardTheme = 'fc27' | 'gold' | 'totw' | 'tots' | 'icon' | 'future' | 'ballon_dor';

export const FifaCardModal: React.FC<FifaCardModalProps> = ({
  player: propPlayer,
  initialPlayer,
  isOpen,
  onClose,
}) => {
  const { activeCareer } = useCareer();
  const player = propPlayer || initialPlayer;
  const [theme, setTheme] = useState<CardTheme>('fc27');
  const [use3DRender, setUse3DRender] = useState<boolean>(true);
  const [playstylePlus, setPlaystylePlus] = useState('Finesse Shot+');
  const [weakFoot, setWeakFoot] = useState(4);
  const [skillMoves, setSkillMoves] = useState(4);

  if (!isOpen || !player) return null;

  const pAny = player as any;
  // Calculate standard FIFA card 6 stats based on player attributes or derive from overall
  const pac = pAny.attributes?.pace ?? Math.min(99, Math.max(55, player.overall + (player.position === 'ST' || player.position === 'LW' || player.position === 'RW' ? 4 : -2)));
  const sho = pAny.attributes?.shooting ?? Math.min(99, Math.max(48, player.overall + (player.position === 'ST' ? 6 : player.position === 'CM' ? -2 : -15)));
  const pas = pAny.attributes?.passing ?? Math.min(99, Math.max(50, player.overall + (player.position === 'CM' || player.position === 'CAM' ? 5 : 0)));
  const dri = pAny.attributes?.dribbling ?? Math.min(99, Math.max(52, player.overall + (['LW', 'RW', 'CAM', 'ST'].includes(player.position) ? 4 : -1)));
  const def = pAny.attributes?.defending ?? Math.min(99, Math.max(35, player.overall + (['CB', 'LB', 'RB', 'CDM'].includes(player.position) ? 5 : -25)));
  const phy = pAny.attributes?.physical ?? Math.min(99, Math.max(50, player.overall + (['CB', 'ST', 'CDM'].includes(player.position) ? 3 : -3)));

  const clubInfo = getClubDetails(pAny.club || activeCareer?.club);
  const playerPhoto = getPlayerPhoto(player.name, pAny.photo);

  const getThemeStyles = () => {
    switch (theme) {
      case 'fc27':
        return {
          cardBg: 'from-neutral-950 via-[#0a120b] to-[#041a10] border-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.3)]',
          badgeBg: 'bg-[#ccff00] text-neutral-950 font-black',
          accentText: 'text-[#ccff00]',
          subText: 'text-[#05f1cd]',
          cardName: 'FC 27 HYPERMOTION V6.0',
          shineColor: 'rgba(204, 255, 0, 0.35)',
        };
      case 'totw':
        return {
          cardBg: 'from-neutral-950 via-neutral-900 to-amber-950/70 border-amber-400/80 shadow-amber-500/20',
          badgeBg: 'bg-amber-400 text-neutral-950',
          accentText: 'text-amber-400',
          subText: 'text-neutral-300',
          cardName: 'TEAM OF THE WEEK IN-FORM',
          shineColor: 'rgba(251, 191, 36, 0.15)',
        };
      case 'tots':
        return {
          cardBg: 'from-blue-950 via-indigo-900 to-amber-900/60 border-blue-400 shadow-blue-500/30',
          badgeBg: 'bg-gradient-to-r from-blue-400 to-amber-400 text-neutral-950',
          accentText: 'text-amber-300',
          subText: 'text-blue-200',
          cardName: 'TEAM OF THE SEASON (TOTS)',
          shineColor: 'rgba(96, 165, 250, 0.2)',
        };
      case 'icon':
        return {
          cardBg: 'from-amber-100 via-amber-50 to-neutral-200 border-amber-300 text-neutral-900 shadow-amber-200/40',
          badgeBg: 'bg-neutral-900 text-amber-300',
          accentText: 'text-amber-700 font-extrabold',
          subText: 'text-neutral-800',
          cardName: 'ULTIMATE ICON',
          shineColor: 'rgba(251, 191, 36, 0.3)',
          isLight: true,
        };
      case 'future':
        return {
          cardBg: 'from-fuchsia-950 via-purple-900 to-cyan-950 border-fuchsia-400 shadow-fuchsia-500/30',
          badgeBg: 'bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-neutral-950',
          accentText: 'text-cyan-300',
          subText: 'text-fuchsia-200',
          cardName: 'FUTURE STARS WONDERKID',
          shineColor: 'rgba(232, 121, 249, 0.25)',
        };
      case 'ballon_dor':
        return {
          cardBg: 'from-amber-600 via-yellow-500 to-amber-700 border-yellow-200 text-neutral-950 shadow-yellow-400/50',
          badgeBg: 'bg-neutral-950 text-yellow-400',
          accentText: 'text-neutral-950 font-black',
          subText: 'text-neutral-900',
          cardName: "BALLON D'OR SPECIAL",
          shineColor: 'rgba(255, 255, 255, 0.4)',
          isLight: true,
        };
      default: // Gold Rare
        return {
          cardBg: 'from-amber-800 via-amber-700 to-yellow-600 border-amber-300/80 text-amber-50 shadow-amber-500/30',
          badgeBg: 'bg-neutral-950 text-amber-400',
          accentText: 'text-amber-200',
          subText: 'text-amber-100/90',
          cardName: 'GOLD RARE ITEM',
          shineColor: 'rgba(253, 224, 71, 0.2)',
        };
    }
  };

  const currentTheme = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                EA Sports FC Studio
              </span>
              <h3 className="text-lg font-black font-display text-white">
                FUT Career Card Generator
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

        {/* Content Body: Left is Card Preview, Right is Customizer */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* THE CARD PREVIEW */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`relative w-64 h-96 rounded-[32px] p-5 border-4 bg-gradient-to-b ${currentTheme.cardBg} shadow-2xl transition-all duration-300 select-none overflow-hidden flex flex-col justify-between`}
              style={{
                boxShadow: `0 20px 40px -10px ${currentTheme.shineColor}`,
              }}
            >
              {/* Shimmer Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.2) 100%)',
                }}
              />

              {/* Top Section: Rating, Position, Nation, Club */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col items-center leading-none">
                  <span
                    className={`text-4xl font-black font-display tracking-tighter ${
                      currentTheme.isLight ? 'text-neutral-950' : 'text-white'
                    }`}
                  >
                    {player.overall}
                  </span>
                  <span
                    className={`text-sm font-bold uppercase mt-1 tracking-wider ${
                      currentTheme.isLight ? 'text-neutral-800' : currentTheme.accentText
                    }`}
                  >
                    {player.position}
                  </span>
                  <div className="w-6 h-0.5 bg-current opacity-30 my-1.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                    {player.nationality.slice(0, 3)}
                  </span>
                  {clubInfo.logo && (
                    <img
                      src={clubInfo.logo}
                      alt={clubInfo.short}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 object-contain mt-1 drop-shadow"
                    />
                  )}
                </div>

                {/* Player Photo / 3D Superstar Model */}
                <div className="w-28 h-28 rounded-2xl bg-black/25 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xs">
                  {use3DRender ? (
                    <img
                      src={ASSETS_3D.superstarRender3D}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top scale-110"
                    />
                  ) : playerPhoto ? (
                    <img
                      src={playerPhoto}
                      alt={player.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <>
                      <span className="text-4xl font-black font-display opacity-90">
                        {player.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                      <span className="text-[10px] font-bold tracking-widest uppercase opacity-70 mt-1">
                        #{player.number}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Middle Section: Player Name */}
              <div className="text-center relative z-10 pt-2 border-b border-current/20 pb-2">
                <h4
                  className={`text-xl font-black uppercase font-display tracking-tight truncate ${
                    currentTheme.isLight ? 'text-neutral-950' : 'text-white'
                  }`}
                >
                  {player.name}
                </h4>
                {/* PlayStyle+ Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-1 rounded-full bg-black/30 border border-white/20 text-[10px] font-bold uppercase tracking-wider">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{playstylePlus}</span>
                </div>
              </div>

              {/* Bottom Section: 6 FIFA Card Stats Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-bold relative z-10 px-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-display">{pac}</span>
                  <span className="text-[10px] opacity-75 uppercase">PAC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-display">{dri}</span>
                  <span className="text-[10px] opacity-75 uppercase">DRI</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-display">{sho}</span>
                  <span className="text-[10px] opacity-75 uppercase">SHO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-display">{def}</span>
                  <span className="text-[10px] opacity-75 uppercase">DEF</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-display">{pas}</span>
                  <span className="text-[10px] opacity-75 uppercase">PAS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black font-display">{phy}</span>
                  <span className="text-[10px] opacity-75 uppercase">PHY</span>
                </div>
              </div>

              {/* Bottom Card Subline */}
              <div className="text-center relative z-10 pt-1">
                <span className="text-[8px] font-bold tracking-widest uppercase opacity-60">
                  {currentTheme.cardName}
                </span>
              </div>
            </div>
          </div>

          {/* CUSTOMIZATION CONTROLS */}
          <div className="space-y-4 text-xs">
            {/* Visual Mode Selector (3D Render vs Real Face) */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-white block">Next-Gen 3D Player Model</span>
                <span className="text-[10px] text-neutral-400">Render EA FC 27 3D superstar graphics</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playToggle();
                  setUse3DRender(!use3DRender);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  use3DRender
                    ? 'bg-[#ccff00] text-neutral-950 shadow-md shadow-[#ccff00]/20'
                    : 'bg-neutral-800 text-neutral-300'
                }`}
              >
                {use3DRender ? '3D Active' : 'Face Photo'}
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Card Item Edition
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'fc27', name: 'FC 27 HyperMotion', icon: '⚡' },
                  { id: 'gold', name: 'Gold Rare', icon: '🏆' },
                  { id: 'totw', name: 'TOTW In-Form', icon: '🔥' },
                  { id: 'tots', name: 'TOTS Elite', icon: '🌟' },
                  { id: 'icon', name: 'Ultimate Icon', icon: '👑' },
                  { id: 'future', name: 'Future Stars', icon: '🔮' },
                  { id: 'ballon_dor', name: "Ballon d'Or", icon: '✨' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTheme(t.id as CardTheme);
                    }}
                    className={`flex items-center gap-1.5 p-2 rounded-xl border font-bold transition text-left text-[11px] ${
                      theme === t.id
                        ? t.id === 'fc27'
                          ? 'bg-[#ccff00] text-neutral-950 border-[#ccff00] shadow-md shadow-[#ccff00]/20'
                          : 'bg-amber-400 text-neutral-950 border-amber-400 shadow-md'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Signature PlayStyle+
              </label>
              <select
                value={playstylePlus}
                onChange={(e) => setPlaystylePlus(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-semibold focus:border-amber-400 focus:outline-none"
              >
                <option value="Finesse Shot+">Finesse Shot+ (Deadly curlers)</option>
                <option value="Rapid+">Rapid+ (Speed dribble burst)</option>
                <option value="Incisive Pass+">Incisive Pass+ (Precision through balls)</option>
                <option value="Technical+">Technical+ (Controlled speed dribbling)</option>
                <option value="Intercept+">Intercept+ (Elite ball anticipation)</option>
                <option value="Power Header+">Power Header+ (Aerial bullet headers)</option>
                <option value="Trivela+">Trivela+ (Outside of foot curling)</option>
                <option value="Bruiser+">Bruiser+ (Physical dominance in duels)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Weak Foot
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setWeakFoot(star)}
                      className={`flex-1 py-1 rounded-lg font-black text-center ${
                        star <= weakFoot ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-950 text-neutral-500'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Skill Moves
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSkillMoves(star)}
                      className={`flex-1 py-1 rounded-lg font-black text-center ${
                        star <= skillMoves ? 'bg-amber-400 text-neutral-950' : 'bg-neutral-950 text-neutral-500'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-neutral-400 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Role in Squad:</span>
                <span className="font-bold text-white">{player.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Potential Ceiling:</span>
                <span className="font-bold text-emerald-400">{player.potential} POT</span>
              </div>
              <div className="flex justify-between">
                <span>Contract Expiry:</span>
                <span className="font-bold text-neutral-200">{player.contractExpiry}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playFanfare();
                  navigator.clipboard?.writeText(
                    `FUT Card: ${player.name} (${player.overall} OVR ${player.position}) - ${currentTheme.cardName}`
                  );
                  alert(`Copied ${player.name}'s card summary to clipboard!`);
                }}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Card</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
