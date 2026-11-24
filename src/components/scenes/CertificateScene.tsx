import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Download, RotateCcw } from 'lucide-react';
import type { SurpriseConfig } from '../../config/personalization';
import { downloadBarbieCertificatePng } from '../../utils/certificateCanvas';
import { CoquetteBowIcon, LaceDivider, WaxHeartSeal } from '../CoquetteIcons';

interface CertificateSceneProps {
  config: SurpriseConfig;
  onReplay: () => void;
}

export function CertificateScene({ config, onReplay }: CertificateSceneProps) {
  const reducedMotion = useReducedMotion();
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    downloadBarbieCertificatePng(config);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3200);
  };

  return (
    <section
      aria-label="Official Barbie Watching Agreement Certificate"
      className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-4xl flex-col items-center justify-center px-4 pt-16 pb-10 sm:px-6 sm:py-10"
    >
      <motion.div
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full space-y-5"
      >
        {/* Certificate Card */}
        <article className="certificate-frame relative overflow-hidden rounded-[2rem] px-6 py-7 text-center sm:px-10 sm:py-9">
          <div className="flex flex-col items-center">
            <CoquetteBowIcon className="mb-2 h-10 w-15" />
            <p className="text-xs font-semibold tracking-widest text-[#B53574] uppercase">
              {config.certificate.treatyLine}
            </p>
            <h1 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-[#70445C] sm:text-4xl">
              {config.certificate.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8E6279] sm:text-base">
              {config.certificate.subtitle}
            </p>
          </div>

          <LaceDivider className="my-5" />

          {/* Recipient */}
          <div>
            <p className="text-xs font-semibold tracking-wider text-[#A16885] uppercase">
              Officially Awarded To
            </p>
            <p className="mt-0.5 font-hand text-4xl font-bold text-[#D94F91] sm:text-5xl">
              {config.sisterNickname}
            </p>
          </div>

          {/* Promise & Mini Terms Reminder */}
          <p className="mx-auto mt-3.5 max-w-2xl text-sm leading-relaxed text-[#70445C] sm:text-base">
            {config.barbieContract.intro}
          </p>

          <div className="mx-auto mt-4 grid max-w-xl grid-cols-1 gap-2 text-left text-xs font-medium text-[#7E5269] sm:grid-cols-2 sm:text-sm">
            {config.barbieContract.terms.map((term, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl bg-[#FFF5F9] px-3.5 py-2 border border-[#F8C8DC]/75"
              >
                <span className="font-display font-bold text-[#D94F91] tabular-nums">
                  {idx + 1}.
                </span>
                <span>{term}</span>
              </div>
            ))}
          </div>

          {/* Signature, Wax Seal, and Date */}
          <div className="mt-6 grid grid-cols-1 items-end gap-5 pt-2 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <p className="font-hand text-2xl font-bold text-[#70445C] sm:text-3xl">
                {config.brotherSignature}
              </p>
              <div className="mt-1.5 h-px w-full max-w-[210px] bg-[#E8A5C4]" />
              <span className="mt-1.5 text-[11px] font-semibold tracking-wider text-[#9C7087] uppercase">
                Brother&apos;s Signature
              </span>
            </div>

            <div className="flex justify-center">
              <WaxHeartSeal className="h-15 w-15 drop-shadow-sm" />
            </div>

            <div className="flex flex-col items-center">
              <p className="font-display text-lg font-semibold text-[#70445C]">
                {config.certificateDate}
              </p>
              <div className="mt-1.5 h-px w-full max-w-[210px] bg-[#E8A5C4]" />
              <span className="mt-1.5 text-[11px] font-semibold tracking-wider text-[#9C7087] uppercase">
                Date Sealed
              </span>
            </div>
          </div>

          <LaceDivider className="my-6" />

          {/* Closing Quote */}
          <p className="mx-auto max-w-xl font-display text-base italic leading-relaxed text-[#B53574] sm:text-lg">
            “{config.certificate.closingNote}”
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleDownload}
              className="ribbon-cta inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold sm:text-base whitespace-nowrap cursor-pointer"
            >
              {downloaded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Certificate Saved!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download Certificate (PNG)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onReplay}
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-[#F2A8C9] bg-white px-6 py-3 text-sm font-semibold text-[#B53574] transition-colors hover:bg-[#FFF0F5] whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Replay from Beginning</span>
            </button>
          </div>
        </article>

        {/* Final Overall Affectionate Footnote */}
        <div className="stationery-card rounded-[1.5rem] px-6 py-6 text-center sm:px-10">
          <p className="font-hand text-2xl leading-relaxed text-[#70445C] sm:text-[1.7rem]">
            “{config.certificate.overallMessage}”
          </p>
        </div>
      </motion.div>
    </section>
  );
}
