import React, { useRef } from 'react';
import { useCareer } from '../../context/CareerContext';
import { X, Download, Upload, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    activeCareer,
    exportCareerJson,
    importCareerJson,
    resetToDemoData,
    deleteCareer,
    updateCareer,
  } = useCareer();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importCareerJson(content);
        if (success) {
          onClose();
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-900/80">
          <div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Configuration</span>
            <h3 className="text-xl font-bold font-display text-white">App & Career Settings</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Active Career Info */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-xs text-neutral-400 uppercase tracking-wider block mb-1">Active Career</span>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{activeCareer?.name}</h4>
                <p className="text-xs text-emerald-400">
                  {activeCareer?.mode === 'manager' ? '👔 Manager Mode' : '⚡ Player Mode'} • {activeCareer?.club} (
                  {activeCareer?.league})
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Season</span>
                <span className="text-sm font-bold text-white">{activeCareer?.currentSeason}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-neutral-850 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Display Currency</span>
              <div className="flex gap-2">
                {(['€', '£', '$'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => activeCareer && updateCareer(activeCareer.id, { currency: curr })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activeCareer?.currency === curr
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Data Backup & Sharing
            </span>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => exportCareerJson()}
                className="flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-xl text-sm font-semibold text-white transition hover:border-emerald-500"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Career (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 p-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-xl text-sm font-semibold text-white transition hover:border-emerald-500"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Import Career</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
            </div>
          </div>

          {/* Danger & Reset */}
          <div className="pt-3 border-t border-neutral-800 space-y-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Management & Reset
            </span>

            <div className="flex items-center justify-between p-3 bg-neutral-950/60 rounded-xl border border-neutral-800">
              <div>
                <div className="text-sm font-semibold text-neutral-200">Load Starter Demo Careers</div>
                <div className="text-xs text-neutral-400">Restore default Real Madrid & Marcus Vance careers</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset to initial sample careers? This will replace your current edits.')) {
                    resetToDemoData();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-300 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-rose-950/20 rounded-xl border border-rose-900/30">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="text-sm font-semibold text-rose-300">Delete Current Career</div>
                  <div className="text-xs text-neutral-400">Permanently delete this active career save</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeCareer && confirm(`Are you sure you want to delete "${activeCareer.name}"?`)) {
                    deleteCareer(activeCareer.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white rounded-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end px-6 py-4 bg-neutral-950 border-t border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
