import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { useOnboarding, useUserName } from "@/lib/user-profile";

const SLIDES = [
  { icon: MapPin, title: "All 14 regions", body: "Browse live school placement availability across every region of Namibia." },
  { icon: Search, title: "Find the right fit", body: "Filter by grade, town, school type and open spaces in a single search." },
  { icon: BarChart3, title: "See inside a class", body: "Tap any grade to view enrolment per class, the field of study and the teacher." },
];

export function Onboarding() {
  const { done, complete } = useOnboarding();
  const { name, setName } = useUserName();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");

  if (done) return null;
  const isNameStep = step === SLIDES.length;
  const Slide = SLIDES[Math.min(step, SLIDES.length - 1)];
  const Icon = Slide.icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 gradient-mesh opacity-70" />
      <div className="relative flex flex-1 flex-col px-6 pb-8 pt-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-background">
              <Sparkles className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <p className="font-display text-sm font-semibold">EduSpace Namibia</p>
          </div>
          {!isNameStep && (
            <button onClick={complete} className="text-xs font-medium text-muted-foreground">Skip</button>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            {isNameStep ? (
              <motion.div key="name" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <h2 className="font-display text-[30px] font-bold leading-tight">What should we call you?</h2>
                <p className="mt-2 text-sm text-muted-foreground">Saved on this device only — it personalises your greeting.</p>
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Your name"
                  className="mt-6 w-full rounded-2xl bg-card px-4 py-4 text-base shadow-[var(--shadow-card)] outline-none ring-ring/40 focus:ring-2"
                />
              </motion.div>
            ) : (
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <div className="grid h-16 w-16 place-items-center rounded-3xl gradient-hero text-background shadow-[var(--shadow-float)]">
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </div>
                <h2 className="mt-7 text-balance font-display text-[30px] font-bold leading-tight">{Slide.title}</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{Slide.body}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1.5">
            {[...SLIDES, null].map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-foreground" : "w-1.5 bg-foreground/20"}`} />
            ))}
          </div>
          <button
            onClick={() => {
              if (isNameStep) {
                if (draft.trim()) setName(draft.trim());
                complete();
              } else setStep((s) => s + 1);
            }}
            className="inline-flex items-center gap-2 rounded-full gradient-hero px-6 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-float)]"
          >
            {isNameStep ? (draft.trim() ? `Continue as ${draft.trim().split(" ")[0]}` : "Skip for now") : "Next"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        {name && !isNameStep && null}
      </div>
    </div>
  );
}
