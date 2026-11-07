import React, { useState } from 'react';
import { useLang } from '../i18n';
import { GOOGLE_SCRIPT_URL } from '../config';
import { LotusDivider } from './Ornament';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: Date;
}

interface WishesSectionProps {
  eventParam?: string;
  inviteeName?: string;
}

const getRelativeTime = (date: Date, si: boolean) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return si ? 'දැන්' : 'just now';
  if (minutes < 60) return si ? `මිනිත්තු ${minutes}කට පෙර` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return si ? `පැය ${hours}කට පෙර` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return si ? `දින ${days}කට පෙර` : `${days}d ago`;
};

export const WishesSection: React.FC<WishesSectionProps> = ({ eventParam = 'both', inviteeName = '' }) => {
  const { t, lang } = useLang();
  const sf = t('font-sinhala', 'font-serif');
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formData, setFormData] = useState({ name: inviteeName, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (inviteeName) {
      setFormData(prev => ({ ...prev, name: inviteeName }));
    }
  }, [inviteeName]);

  // Load wishes already saved in the sheet (rows with Show = YES).
  React.useEffect(() => {
    if (!GOOGLE_SCRIPT_URL) return;
    let cancelled = false;
    fetch(`${GOOGLE_SCRIPT_URL}?action=wishes`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.ok || !Array.isArray(data.wishes)) return;
        setWishes((prev) => {
          const loaded: Wish[] = data.wishes.map((w: { id: string; name: string; message: string; createdAt: string | null }) => ({
            id: `sheet-${w.id}`,
            name: w.name,
            message: w.message,
            createdAt: w.createdAt ? new Date(w.createdAt) : new Date(),
          }));
          // Keep any wish posted in this visit before the list finished loading.
          const local = prev.filter((p) => !p.id.startsWith('sheet-'));
          return [...local, ...loaded];
        });
      })
      .catch((err) => console.error('Could not load wishes: ', err));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setIsSubmitting(true);

    try {
      if (!GOOGLE_SCRIPT_URL) throw new Error('Google Apps Script URL is not set (src/config.ts).');

      const payload = new FormData();
      payload.append('sheet', 'WISH');
      payload.append('name', formData.name);
      payload.append('message', formData.message);
      payload.append('event', eventParam);
      payload.append('lang', lang);

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      });

      const newWish: Wish = {
        id: Date.now().toString(),
        name: formData.name,
        message: formData.message,
        createdAt: new Date(),
      };
      
      // Prepend the new wish to the list
      setWishes(prev => [newWish, ...prev]);
      setFormData({ name: inviteeName, message: '' });
      toast.success(t('ඔබගේ සුබපැතුම ලැබුණි. ස්තූතියි!', 'Your beautiful blessing has been shared!'));
    } catch (error) {
      console.error('Error submitting wish: ', error);
      toast.error(t('යැවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.', 'Could not send your wishes. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 relative py-12">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-3/4 h-3/4 bg-brand-lavender/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-16 relative">
        <LotusDivider className="mx-auto mb-5" />
        <Sparkles className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-brand-lavender/40 animate-pulse" />
        <span className="text-brand-plum uppercase tracking-[0.5em] text-[10px] font-bold mb-4 block drop-shadow-sm">
          {t('සුබපැතුම්', 'Guestbook')}
        </span>
        <h2 className={`text-5xl sm:text-7xl ${sf} text-stone-800 tracking-tight drop-shadow-sm`}>
          {t(<>ආශිර්වාද සහ <span className="italic font-light text-brand-plum">සුබපැතුම්</span></>, <>Blessings &amp; <span className="italic font-light text-brand-plum">Wishes</span></>)}
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-brand-lavender/60 to-transparent mx-auto mt-8" />
      </div>

      <div className="flex flex-col items-center">
        
        {/* Beautiful Centered Form Box */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-full glass p-8 sm:p-14 rounded-[3rem] border border-white/60 shadow-[0_30px_60px_rgba(176,137,104,0.1)] relative overflow-hidden bg-white/70 backdrop-blur-3xl mb-16"
        >
          {/* Subtle top reflection line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-lavender to-transparent opacity-50" />

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-10">
              <p className={`text-stone-500 ${sf} text-lg leading-relaxed max-w-lg mx-auto`}>
                {t('අපගේ නව දිවියට ඔබගේ ආශිර්වාදය හා සුබපැතුම් මෙහි ලියන්න.', 'Leave your blessings and wishes for our journey ahead.')}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2 text-left">{t('ඔබගේ නම', 'Your Name')}</label>
                <input
                  required
                  type="text"
                  placeholder={t('ඔබගේ නම', 'E.g., Uncle John')}
                  className="w-full bg-white/80 px-6 py-4 rounded-full border border-stone-200/60 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all duration-300 font-serif italic text-lg shadow-inner placeholder:text-stone-300 text-stone-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 ml-2 text-left">{t('ඔබගේ පණිවිඩය', 'Your Message')}</label>
                <textarea
                  required
                  placeholder={t('ඔබගේ සුබපැතුම් මෙහි ලියන්න...', 'Wishing you a lifetime of happiness...')}
                  className="w-full bg-white/80 px-6 py-5 rounded-[2rem] border border-stone-200/60 focus:ring-2 focus:ring-brand-lavender/30 focus:border-brand-plum/40 outline-none transition-all duration-300 h-36 resize-none font-serif italic text-lg shadow-inner placeholder:text-stone-300 text-stone-700"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 max-w-sm mx-auto">
              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-stone-800 text-brand-rose py-5 rounded-full font-sans tracking-[0.3em] font-bold text-[11px] uppercase hover:bg-stone-900 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)] active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 text-brand-plum" />
                    {t('සුබපැතුම් යවන්න', 'Share Blessing')}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Wishes List - Stacked Centrally Below */}
        <div className="w-full space-y-6 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin">
          <AnimatePresence initial={false}>
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass p-8 sm:p-10 rounded-3xl border border-brand-lavender/20 shadow-sm relative overflow-hidden group bg-white/50 backdrop-blur-sm"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-brand-plum/20 to-brand-lavender/40 group-hover:from-brand-plum group-hover:to-brand-lavender transition-all duration-500" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                  <h4 className="font-display text-2xl text-stone-800 tracking-tight pl-2">{wish.name}</h4>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-bold bg-white/60 px-3 py-1 rounded-full border border-stone-100/50">
                    {wish.createdAt ? getRelativeTime(wish.createdAt, lang === 'si') : t('දැන්', 'just now')}
                  </span>
                </div>
                <p className="text-stone-600 font-serif italic text-lg sm:text-lg leading-relaxed pl-2">
                  "{wish.message}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
