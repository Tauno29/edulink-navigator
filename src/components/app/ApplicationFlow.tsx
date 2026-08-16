import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Camera, Check, CheckCircle2, CreditCard, FileText, Loader2, Sparkles,
  Upload, X, Zap, Building2, Home, ShieldCheck, Lock,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  startPriorityCheckout, getPriorityOrder, completeSandboxPayment,
} from "@/lib/payments.functions";
import {
  newApplicationId, saveApplication, setPriorityAlerts, NAM_BANKS, PRIORITY_FEE,
  type Application, type UploadedDoc,
} from "@/lib/applications";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  schoolId: string;
  schoolName: string;
  grade: string;
  isSecondary: boolean;
  waitlist: boolean;
};

const STREAMS = ["Pure Science", "Commercial", "General"];
const GENDERS = ["Female", "Male", "Other"];

export function ApplicationFlow(props: Props) {
  const { open, onOpenChange, schoolId, schoolName, grade, isSecondary, waitlist } = props;
  const [step, setStep] = useState(0); // 0..2 wizard, 3 = done
  const [saved, setSaved] = useState<Application | null>(null);

  // Step 1
  const [learnerName, setLearnerName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState(isSecondary ? STREAMS[0] : "");
  const [hostel, setHostel] = useState(false);
  const [guardian, setGuardian] = useState("");
  const [relationship, setRelationship] = useState("Parent");
  const [phone, setPhone] = useState("");

  // Step 2
  const [docs, setDocs] = useState<Record<string, UploadedDoc | undefined>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const gradeNumber = useMemo(() => {
    const m = /Grade (\d+)/.exec(grade);
    return m ? Number(m[1]) : 0;
  }, [grade]);
  const reportRequired = gradeNumber >= 2;

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setStep(0); setSaved(null); setConfirmed(false); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const phoneDigits = phone.replace(/\D/g, "");
  const step1Valid =
    learnerName.trim().length > 1 && dob !== "" && gender !== "" &&
    guardian.trim().length > 1 && phoneDigits.length >= 8;
  const step2Valid = !!docs.birth && (!reportRequired || !!docs.report);

  const submit = () => {
    setSubmitting(true);
    const app: Application = {
      id: newApplicationId(),
      school_id: schoolId,
      school_name: schoolName,
      grade,
      stream: stream || undefined,
      learner_name: learnerName.trim(),
      learner_dob: dob,
      learner_gender: gender,
      hostel,
      guardian_name: guardian.trim(),
      guardian_relationship: relationship,
      parent_whatsapp: `+264${phoneDigits.replace(/^264/, "").replace(/^0/, "")}`,
      docs_urls: Object.values(docs).filter(Boolean).map((d) => ({ slot: d!.slot, name: d!.name })),
      waitlist,
      status: "PENDING",
      has_priority_alerts: false,
      created_at: new Date().toISOString(),
    };
    setTimeout(() => {
      saveApplication(app);
      setSaved(app);
      setSubmitting(false);
      setStep(3);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="left-1/2 top-auto bottom-0 max-h-[92vh] w-full max-w-2xl translate-y-0 gap-0 overflow-y-auto rounded-t-3xl border-0 p-0 shadow-[var(--shadow-float)] sm:rounded-t-3xl [&>button]:hidden"
      >
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
          {step > 0 && step < 3 ? (
            <button aria-label="Back" onClick={() => setStep((s) => s - 1)} className="grid h-9 w-9 place-items-center rounded-full bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : <div className="h-9 w-9" />}
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate font-display text-sm font-semibold">
              {step === 3 ? "Application submitted" : waitlist ? "Waitlist application" : "Apply"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">{grade} · {schoolName}</p>
          </div>
          <button aria-label="Close" onClick={() => onOpenChange(false)} className="grid h-9 w-9 place-items-center rounded-full bg-muted">
            <X className="h-4 w-4" />
          </button>
        </header>

        {step < 3 && (
          <div className="flex gap-1.5 px-4 pt-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div className="h-full rounded-full bg-primary" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.3 }} />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 pb-8 pt-4"
          >
            {step === 0 && (
              <div className="space-y-4">
                <SectionTitle title="Learner details" subtitle="Tell us who is being placed." />
                <Field label="Learner full name">
                  <input value={learnerName} maxLength={100} onChange={(e) => setLearnerName(e.target.value)} placeholder="e.g. Ndapewa Shikongo" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date of birth">
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Gender">
                    <div className="flex gap-1.5">
                      {GENDERS.map((g) => (
                        <Chip key={g} active={gender === g} onClick={() => setGender(g)}>{g}</Chip>
                      ))}
                    </div>
                  </Field>
                </div>
                <Field label="Grade applying for">
                  <div className="rounded-2xl bg-muted px-4 py-3 text-sm font-medium">{grade}</div>
                </Field>
                {isSecondary && (
                  <Field label="Subject stream">
                    <div className="flex flex-wrap gap-1.5">
                      {STREAMS.map((s) => <Chip key={s} active={stream === s} onClick={() => setStream(s)}>{s}</Chip>)}
                    </div>
                  </Field>
                )}
                <div className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
                  <span className="flex items-center gap-2 text-sm"><Home className="h-4 w-4 text-muted-foreground" /> Hostel accommodation needed</span>
                  <button
                    role="switch"
                    aria-checked={hostel}
                    aria-label="Hostel accommodation needed"
                    onClick={() => setHostel((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${hostel ? "bg-primary" : "bg-muted"}`}
                  >
                    <motion.span layout className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow ${hostel ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>

                <SectionTitle title="Guardian details" subtitle="Where placement updates will be sent." />
                <Field label="Guardian / parent full name">
                  <input value={guardian} maxLength={100} onChange={(e) => setGuardian(e.target.value)} placeholder="e.g. Selma Shikongo" className={inputCls} />
                </Field>
                <Field label="Relationship">
                  <div className="flex flex-wrap gap-1.5">
                    {["Parent", "Guardian", "Grandparent", "Sibling"].map((r) => (
                      <Chip key={r} active={relationship === r} onClick={() => setRelationship(r)}>{r}</Chip>
                    ))}
                  </div>
                </Field>
                <Field label="WhatsApp number">
                  <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-[var(--shadow-card)]">
                    <span className="text-sm font-semibold text-muted-foreground">+264</span>
                    <input
                      inputMode="tel"
                      maxLength={12}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, ""))}
                      placeholder="81 234 5678"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </Field>
                <PrimaryButton disabled={!step1Valid} onClick={() => setStep(1)}>Continue to documents</PrimaryButton>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <SectionTitle title="Documents" subtitle="Take a photo with your phone or upload a PDF/JPG." />
                <DropZone
                  label="Learner birth certificate"
                  hint="Required · photo or PDF"
                  doc={docs.birth}
                  onPick={(d) => setDocs((p) => ({ ...p, birth: d ? { ...d, slot: "birth" } : undefined }))}
                />
                <DropZone
                  label="Latest term / previous school report"
                  hint={reportRequired ? "Required for Grade 2–12" : "Optional for this grade"}
                  doc={docs.report}
                  onPick={(d) => setDocs((p) => ({ ...p, report: d ? { ...d, slot: "report" } : undefined }))}
                />
                <DropZone
                  label="Transfer letter / ID copy"
                  hint="Optional"
                  doc={docs.other}
                  onPick={(d) => setDocs((p) => ({ ...p, other: d ? { ...d, slot: "other" } : undefined }))}
                />
                <PrimaryButton disabled={!step2Valid} onClick={() => setStep(2)}>Review application</PrimaryButton>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <SectionTitle title="Review & confirm" subtitle="Check everything before submitting." />
                <div className="space-y-2 rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
                  <Row label="Learner" value={learnerName} />
                  <Row label="Date of birth" value={dob} />
                  <Row label="Gender" value={gender} />
                  <Row label="Grade" value={grade} />
                  {stream && <Row label="Stream" value={stream} />}
                  <Row label="Hostel" value={hostel ? "Yes" : "No"} />
                  <Row label="Guardian" value={`${guardian} (${relationship})`} />
                  <Row label="WhatsApp" value={`+264 ${phone.trim()}`} />
                  <Row label="School" value={`${schoolName} · ${waitlist ? "Waitlist" : "Open placement"}`} />
                </div>
                <div className="space-y-2 rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
                  <p className="font-display text-sm font-semibold">Attached documents</p>
                  {Object.values(docs).filter(Boolean).map((d) => (
                    <div key={d!.slot} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" /> <span className="truncate">{d!.name}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setConfirmed((v) => !v)} className="flex w-full items-start gap-3 rounded-2xl bg-muted/60 p-4 text-left">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${confirmed ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {confirmed && <Check className="h-3.5 w-3.5" />}
                  </span>
                  <span className="text-xs leading-relaxed">I confirm all information submitted is true and accurate.</span>
                </button>
                <PrimaryButton disabled={!confirmed || submitting} onClick={submit}>
                  {submitting ? <><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Submitting…</> : "Submit application"}
                </PrimaryButton>
              </div>
            )}

            {step === 3 && saved && (
              <CompletionScreen app={saved} onClose={() => onOpenChange(false)} />
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function CompletionScreen({ app, onClose }: { app: Application; onClose: () => void }) {
  const [priority, setPriority] = useState(app.has_priority_alerts);
  const [showEft, setShowEft] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const activate = () => {
    setPriorityAlerts(app.id, true);
    setPriority(true);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-card p-5 text-center shadow-[var(--shadow-card)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <p className="mt-3 font-display text-lg font-bold">Application received</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Your application has been received and sent directly to the school administration office at {app.school_name}. You will receive standard updates when processed.
        </p>
        <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">Reference · {app.id.slice(-6).toUpperCase()}</p>
      </div>

      {priority ? (
        <div className="rounded-3xl border border-success/30 bg-success/5 p-5 text-center">
          <Zap className="mx-auto h-5 w-5 text-success" />
          <p className="mt-2 font-display text-sm font-semibold">Fast-Track WhatsApp alerts active</p>
          <p className="mt-1 text-xs text-muted-foreground">Priority updates will be sent to {app.parent_whatsapp}.</p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl bg-card p-5 shadow-[var(--shadow-float)]">
          <div aria-hidden className="pointer-events-none absolute inset-0 gradient-mesh opacity-40" />
          <div className="relative">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Recommended for peace of mind
            </span>
            <p className="mt-3 font-display text-base font-bold">Fast-Track WhatsApp Instant Placement Alerts</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Skip the anxiety. Get instant priority WhatsApp notifications the second the school admin reviews, shortlists or accepts your child&apos;s placement — plus live queue tracking.
            </p>
            <p className="mt-3 font-display text-2xl font-bold">N${PRIORITY_FEE}.00 <span className="text-xs font-medium text-muted-foreground">NAD · one-time</span></p>

            <div className="mt-4 space-y-2">
              {checkout ? (
                <CardCheckout app={app} onPaid={activate} onCancel={() => setCheckout(false)} />
              ) : (
                <button onClick={() => setCheckout(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition active:scale-[0.98]">
                  <CreditCard className="h-4 w-4" /> Pay via PayToday / Card
                </button>
              )}
              <button onClick={() => setShowEft((v) => !v)} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold transition active:scale-[0.98]">
                <Upload className="h-4 w-4" /> Upload EFT proof of payment
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showEft && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-3 space-y-2">
                    {NAM_BANKS.map((b) => (
                      <div key={b.bank} className="rounded-2xl bg-muted/60 p-3 text-[11px]">
                        <p className="flex items-center gap-1.5 font-display text-xs font-semibold"><Building2 className="h-3.5 w-3.5" /> {b.bank}</p>
                        <p className="mt-1 text-muted-foreground">Account · <span className="tabular-nums text-foreground">{b.account}</span></p>
                        <p className="text-muted-foreground">Branch · <span className="tabular-nums text-foreground">{b.branch}</span></p>
                        <p className="text-muted-foreground">Reference · <span className="text-foreground">{b.ref}</span></p>
                      </div>
                    ))}
                    <DropZone
                      label="Proof of payment"
                      hint="Screenshot or PDF"
                      doc={undefined}
                      onPick={(d) => {
                        if (!d) return;
                        setPriorityAlerts(app.id, true);
                        setPriority(true);
                        toast.success("Proof of payment received — alerts activated after verification");
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Link to="/" onClick={onClose} className="block rounded-2xl bg-foreground px-4 py-3 text-center text-sm font-semibold text-background transition active:scale-[0.98]">
          Return to home
        </Link>
        {!priority && (
          <button onClick={onClose} className="w-full py-2 text-center text-xs text-muted-foreground underline underline-offset-4">
            Skip and continue with free standard updates
          </button>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-2xl bg-card px-4 py-3 text-sm shadow-[var(--shadow-card)] outline-none ring-primary/40 focus:ring-2";

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="pt-1">
      <p className="font-display text-base font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-xs font-medium transition active:scale-95 ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right font-medium">{value}</span>
    </div>
  );
}

function PrimaryButton({ disabled, onClick, children }: { disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-float)] transition active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100"
    >
      {children}
    </button>
  );
}

function DropZone({
  label, hint, doc, onPick,
}: { label: string; hint: string; doc?: UploadedDoc; onPick: (d?: UploadedDoc) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  const handle = (file?: File | null) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) { toast.error("File must be under 8 MB"); return; }
    setProgress(10);
    const url = URL.createObjectURL(file);
    let p = 10;
    const timer = setInterval(() => {
      p += 25;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timer);
        onPick({ slot: "other", name: file.name, size: file.size, type: file.type, url });
      }
    }, 120);
  };

  const isImage = doc?.type?.startsWith("image/");

  return (
    <div className="rounded-3xl bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold">{label}</p>
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        </div>
        {doc && <span className="shrink-0 rounded-full bg-success/10 px-2 py-1 text-[10px] font-semibold text-success">Attached</span>}
      </div>

      {doc ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-muted/60 p-2.5">
          {isImage && doc.url ? (
            <img src={doc.url} alt={doc.name} className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-background"><FileText className="h-5 w-5 text-muted-foreground" /></div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{doc.name}</p>
            <p className="text-[10px] text-muted-foreground">{(doc.size / 1024).toFixed(0)} KB</p>
          </div>
          <button onClick={() => camRef.current?.click()} className="rounded-full bg-background px-3 py-1.5 text-[11px] font-medium">Retake</button>
          <button aria-label="Remove file" onClick={() => { onPick(undefined); setProgress(0); }} className="grid h-7 w-7 place-items-center rounded-full bg-background"><X className="h-3.5 w-3.5" /></button>
        </div>
      ) : progress > 0 ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => camRef.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-xs font-medium transition active:scale-[0.98]">
            <Camera className="h-4 w-4" /> Scan photo
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-xs font-medium transition active:scale-[0.98]">
            <Upload className="h-4 w-4" /> Upload file
          </button>
        </div>
      )}

      <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handle(e.target.files?.[0])} />
      <input ref={fileRef} type="file" accept="image/*,application/pdf" hidden onChange={(e) => handle(e.target.files?.[0])} />
    </div>
  );
}