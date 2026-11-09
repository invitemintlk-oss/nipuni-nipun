import React from 'react';
import { motion } from 'motion/react';
import { useLang } from '../i18n';
import { LotusDivider } from './Ornament';

const PHOTOS = [
  { src: '/pre/couple-2.jpeg', position: '70% center' },
  { src: '/pre/couple-3.jpeg', position: 'center center' },
];

export const CouplePhotos: React.FC = () => {
  const { t } = useLang();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
      <div className="text-center mb-12 sm:mb-16">
        <LotusDivider className="mx-auto mb-5" />
        <span className="text-brand-plum uppercase tracking-[0.5em] text-[11px] font-semibold font-sans drop-shadow-sm">
          {t('අපේ සුන්දර මොහොත', 'Our Moments')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {PHOTOS.map((photo, i) => (
          <motion.figure
            key={photo.src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
            className="relative"
          >
            <div className="absolute -inset-3 sm:-inset-4 border border-brand-lavender/40 rounded-[2rem] translate-x-2 translate-y-2 pointer-events-none" />
            <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden border-4 border-white shadow-[0_25px_50px_rgba(98,114,84,0.2)] group">
              <img
                src={photo.src}
                alt={t('නිපුන් සහ නිපුනි', 'Nipun & Nipuni')}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                style={{ objectPosition: photo.position }}
              />
            </div>
          </motion.figure>
        ))}
      </div>
    </div>
  );
};
