import React from 'react';
import { useLang } from '../i18n';
import { LotusDivider } from './Ornament';
import { motion } from 'motion/react';
import { Clock, Calendar, MapPin, Heart, Sparkles, Palette, Utensils } from 'lucide-react';

interface CeremonyDetailsProps {
  event?: string | null;
}

export const CeremonyDetails: React.FC<CeremonyDetailsProps> = ({ event = 'both' }) => {
  const { t, lang } = useLang();
  const sf = t('font-sinhala', 'font-serif');
  const isHomecoming = event === 'homecoming';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Premium ambient backdrop */}
      <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-radial from-brand-lavender/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Text Content */}
        <div className="w-full max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <LotusDivider className="mb-5" />
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="text-brand-plum uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[11px] sm:text-xs font-bold drop-shadow-sm">
                {t('උත්සව විස්තර', 'The Sacred Union')}
              </span>
              <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-brand-plum/60 to-transparent" />
            </div>

            <h2 className={`text-5xl sm:text-6xl lg:text-7xl ${sf} text-stone-800 mb-8 leading-[1.1] drop-shadow-sm`}>
                {t(<>මංගල <br /><span className="italic font-light text-brand-plum">උත්සවය</span></>, <>The Wedding <br /><span className="italic font-light text-brand-plum">Ceremony</span></>)}
            </h2>

            <p className={`text-stone-500/90 ${sf} text-lg sm:text-xl leading-relaxed mb-16 max-w-lg`}>
                {t('හෝටල් පරිශ්‍රයේ දී පැවැත්වෙන මංගල උත්සවයට ඔබව අපි ගෞරවයෙන් ආරාධනා කරන්නෙමු.', 'Together with love, we welcome you to share our happiness on this beautiful day.')}
            </p>

            {/* Premium Timeline */}
            <div className="relative space-y-12 ml-10 sm:ml-12 border-l-[1.5px] border-brand-lavender/30 pl-10 sm:pl-12 py-4">

              {/* Date */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <Calendar className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className={`${sf} text-2xl sm:text-3xl text-stone-800 group-hover:text-brand-plum transition-colors duration-500`}>
                    {t('2026 දෙසැම්බර් 11 සිකුරාදා', 'Friday, 11th December 2026')}
                  </h4>
                </div>
              </div>

              {/* Location */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <MapPin className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className={`${sf} text-2xl sm:text-3xl text-stone-800 leading-relaxed group-hover:text-brand-plum transition-colors duration-500`}>
                    <span className="font-semibold text-stone-700">{t('ස්ථානය:', 'Venue:')}</span> {t(<>රොන්ෆා රීජන්සි (ක්වීන් කෝට්), <br className="hidden sm:block" /> ගනේමුල්ල</>, <>Queen Court, <br className="hidden sm:block" /> Rongfa Regency, Ganemulla</>)}
                  </h4>
                </div>
              </div>

              {/* Time */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <Clock className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className={`${sf} text-2xl sm:text-3xl text-stone-800 leading-relaxed group-hover:text-brand-plum transition-colors duration-500`}>
                    <span className="font-semibold text-stone-700">{t('වේලාව:', 'Time:')}</span> {t('ප.ව. 6.00 සිට ප.ව. 10.30 දක්වා', '6.00 PM - 10.30 PM')}
                  </h4>
                </div>
              </div>

              {/* Poruwa Ceremony */}
              <div className="relative group flex items-center min-h-[48px]">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-lavender/40 shadow-lg flex items-center justify-center group-hover:border-brand-plum group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <Sparkles className="w-5 h-5 text-brand-plum group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className={`${sf} text-2xl sm:text-3xl text-stone-800 leading-relaxed group-hover:text-brand-plum transition-colors duration-500`}>
                    <span className="font-semibold text-stone-700">{t('පෝරුවේ චාරිත්‍රය:', 'Poruwa Ceremony:')}</span> {t('ප.ව. 6.31 ට', '6.31 PM')}
                  </h4>
                </div>
              </div>


            </div>
          </motion.div>
        </div>


      </div>
    </div>
  );
};
