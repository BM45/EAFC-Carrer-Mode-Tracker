import React, { useState, useEffect } from 'react';
import { useCareer } from '../../context/CareerContext';
import { sound } from '../../utils/soundEffects';
import {
  X,
  Mic,
  Send,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Newspaper,
  Flame,
} from 'lucide-react';

interface PressConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PressQuestion {
  id: string;
  journalist: string;
  question: string;
  options: {
    text: string;
    moraleImpact: string;
    trait: string;
  }[];
}

export const PressConferenceModal: React.FC<PressConferenceModalProps> = ({ isOpen, onClose }) => {
  const { activeCareer, matches, addJournalEntry, selectedSeason } = useCareer();

  const [loading, setLoading] = useState(false);
  const [headline, setHeadline] = useState('');
  const [questions, setQuestions] = useState<PressQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, { text: string; moraleImpact: string }>>({});
  const [conferenceFinished, setConferenceFinished] = useState(false);

  const lastMatch = matches[0];

  useEffect(() => {
    if (isOpen) {
      loadPressConference();
    } else {
      setAnswers({});
      setConferenceFinished(false);
    }
  }, [isOpen]);

  const loadPressConference = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/press-conference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          careerName: activeCareer?.name,
          club: activeCareer?.club,
          mode: activeCareer?.mode,
          recentResult: lastMatch?.result || 'W',
          opponent: lastMatch?.opponent || 'Rivals',
          score: lastMatch ? `${lastMatch.ourGoals}-${lastMatch.opponentGoals}` : '2-0',
          season: selectedSeason === 'all' ? activeCareer?.currentSeason : selectedSeason,
        }),
      });
      const data = await res.json();
      setHeadline(data.headline || `${activeCareer?.club} Post-Match Press Briefing`);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error('Failed to load press conference:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (qId: string, option: { text: string; moraleImpact: string }) => {
    sound.playClick();
    const updated = { ...answers, [qId]: option };
    setAnswers(updated);

    if (Object.keys(updated).length === questions.length) {
      setConferenceFinished(true);
      sound.playLevelUp();
    }
  };

  const handleSaveToJournal = () => {
    if (!activeCareer) return;

    const notesSummary = Object.entries(answers)
      .map(([qId, opt]) => {
        const q = questions.find((item) => item.id === qId);
        return `Q (${q?.journalist}): "${q?.question}"\nAns: "${opt.text}" (${opt.moraleImpact})`;
      })
      .join('\n\n');

    addJournalEntry({
      season: selectedSeason === 'all' ? activeCareer.currentSeason : selectedSeason,
      date: new Date().toISOString().split('T')[0],
      title: headline,
      headline: `Press Briefing Reaction: ${Object.values(answers)[0]?.text.slice(0, 75)}...`,
      content: notesSummary,
      category: 'press',
    });

    sound.playLevelUp();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                  Media Zone
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                  AI Powered Press Room
                </span>
              </div>
              <h3 className="text-xl font-black font-display text-white">
                Official Press Conference
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-neutral-400 space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-spin" />
              <p className="text-sm font-semibold text-white">
                Reporters taking their seats in the press room...
              </p>
              <p className="text-xs text-neutral-500">
                Generating contextual questions based on your season performance
              </p>
            </div>
          ) : (
            <>
              {/* Press Room Banner */}
              <div className="p-4 bg-gradient-to-r from-indigo-950/40 via-neutral-950 to-neutral-900 rounded-2xl border border-indigo-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Newspaper className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Live Broadcast Feed
                  </span>
                </div>
                <h4 className="text-base font-bold font-display text-white">{headline}</h4>
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const currentAnswer = answers[q.id];

                  return (
                    <div
                      key={q.id}
                      className="p-5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-400">
                          {q.journalist}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          Question {idx + 1} of {questions.length}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-white leading-relaxed">
                        "{q.question}"
                      </p>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = currentAnswer?.text === opt.text;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, opt)}
                              className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition flex items-start justify-between gap-3 ${
                                isSelected
                                  ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-sm'
                                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
                              }`}
                            >
                              <div className="space-y-1">
                                <span className="block">{opt.text}</span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400">
                                  Tone: {opt.trait}
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  opt.moraleImpact.startsWith('+')
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : opt.moraleImpact.startsWith('-')
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}
                              >
                                {opt.moraleImpact}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {conferenceFinished
              ? 'All questions answered! Press quotes recorded.'
              : `${Object.keys(answers).length} / ${questions.length} Questions Answered`}
          </span>

          <div className="flex items-center gap-2">
            {conferenceFinished && (
              <button
                type="button"
                onClick={handleSaveToJournal}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Highlights to Career Journal</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
