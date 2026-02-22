import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Scale, Bot, Shield, Zap, Search, CheckCircle2 } from 'lucide-react';

/* ──────────────────────────────────────────────
   Hero Mock-Window Animation
   ────────────────────────────────────────────── */
const HeroMockWindow = () => {
  const [phase, setPhase] = useState<'email' | 'scan' | 'result'>('email');

  useEffect(() => {
    const cycle = () => {
      setPhase('email');
      const t1 = setTimeout(() => setPhase('scan'), 1800);
      const t2 = setTimeout(() => setPhase('result'), 3600);
      const t3 = setTimeout(cycle, 5800);
      return [t1, t2, t3];
    };
    const timers = cycle();
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto mt-14 w-full max-w-2xl">
      <div className="rounded-2xl border border-[hsl(0,0%,88%)] bg-[hsl(0,0%,100%)]/80 p-1 shadow-xl shadow-[hsl(0,0%,0%)]/5 backdrop-blur-xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 rounded-t-xl border-b border-[hsl(0,0%,90%)] bg-[hsl(0,0%,97%)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(0,70%,60%)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(43,90%,55%)]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[hsl(152,55%,50%)]" />
          </div>
          <span className="ml-2 text-[11px] font-medium text-[hsl(0,0%,50%)]">CompensAI Agent</span>
        </div>

        {/* Content area */}
        <div className="relative h-48 overflow-hidden rounded-b-xl bg-[hsl(0,0%,99%)] p-6">
          <AnimatePresence mode="wait">
            {phase === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(0,0%,94%)]">
                    <Mail className="h-4 w-4 text-[hsl(0,0%,45%)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[hsl(0,0%,15%)]">RyanAir Notification</p>
                    <p className="text-xs text-[hsl(0,0%,55%)]">Flight FR1234 — Delay 4h 20m</p>
                  </div>
                </div>
                <div className="rounded-lg border border-[hsl(0,0%,90%)] bg-[hsl(0,0%,97%)] p-3">
                  <p className="text-xs leading-relaxed text-[hsl(0,0%,45%)]">
                    Dear passenger, we regret to inform you that your flight FR1234 from Dublin
                    to Barcelona scheduled for 14:00 has been delayed by approximately 4 hours
                    and 20 minutes due to operational reasons...
                  </p>
                </div>
              </motion.div>
            )}

            {phase === 'scan' && (
              <motion.div
                key="scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-full flex-col items-center justify-center gap-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/30 border-t-primary"
                >
                  <Search className="h-5 w-5 text-primary" />
                </motion.div>
                <div className="space-y-1 text-center">
                  <p className="text-sm font-semibold text-[hsl(0,0%,15%)]">Analyzing claim eligibility...</p>
                  <p className="text-xs text-[hsl(0,0%,55%)]">Cross-referencing EU Regulation 261/2004</p>
                </div>
                {/* Scan bar */}
                <motion.div
                  className="h-0.5 w-full rounded-full bg-primary/20"
                >
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.6, ease: 'easeInOut' }}
                  />
                </motion.div>
              </motion.div>
            )}

            {phase === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex h-full flex-col items-center justify-center gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle2 className="h-12 w-12 text-[hsl(152,60%,40%)]" />
                </motion.div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[hsl(0,0%,15%)]">Claim Eligible</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-1 text-3xl font-extrabold text-primary"
                  >
                    €600
                  </motion.p>
                  <p className="mt-1 text-xs text-[hsl(0,0%,55%)]">EU261 — Flight delay &gt;3 hours</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────
   Pipeline Visualization (Sticky Left)
   ────────────────────────────────────────────── */
const pipelineSteps = [
  { icon: Mail, label: 'Monitor' },
  { icon: Scale, label: 'Triage' },
  { icon: Bot, label: 'File' },
];

const PipelineNode = ({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Mail;
  label: string;
  active: boolean;
}) => (
  <div className="flex items-center gap-4">
    <motion.div
      animate={{
        boxShadow: active
          ? '0 0 24px hsl(20, 90%, 48%), 0 0 48px hsl(20, 90%, 48%)'
          : '0 0 0px transparent',
        borderColor: active ? 'hsl(20, 90%, 48%)' : 'hsl(0, 0%, 85%)',
        backgroundColor: active ? 'hsl(20, 90%, 48%)' : 'hsl(0, 0%, 97%)',
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2"
    >
      <motion.div
        animate={{ scale: active ? 1.15 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon
          className="h-6 w-6"
          style={{ color: active ? 'white' : 'hsl(0, 0%, 45%)' }}
        />
      </motion.div>
    </motion.div>
    <motion.span
      animate={{
        color: active ? 'hsl(0, 0%, 10%)' : 'hsl(0, 0%, 55%)',
        fontWeight: active ? 600 : 400,
      }}
      transition={{ duration: 0.3 }}
      className="text-sm"
    >
      {label}
    </motion.span>
  </div>
);

/* ──────────────────────────────────────────────
   Solution / How-it-works Section
   ────────────────────────────────────────────── */
const solutionSteps = [
  {
    title: 'Secure Monitoring',
    body: 'Our agents connect securely to your inbox, scanning only for transactional signals like flight cancellations, delivery failures, and overcharges. No sensitive data leaves your environment.',
  },
  {
    title: 'Legal Triage',
    body: 'We cross-reference your situation against international regulations like EU261, consumer protection directives, and carrier-specific policies to determine eligibility instantly.',
  },
  {
    title: 'Autonomous Filing',
    body: 'Our infrastructure drafts legally binding claims, navigates the vendor\'s bureaucracy, and follows up automatically. You approve once — we handle everything else.',
  },
];

const SolutionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => setProgress(v));

  const activeStep = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;
  // Line fill: 0 at top node, 1 at bottom node
  const lineFill = Math.min(1, progress * 1.1);

  return (
    <section ref={containerRef} className="relative min-h-[150vh]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Three autonomous steps. Zero manual effort.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left: Sticky Pipeline */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="sticky top-1/3">
              <div className="relative flex flex-col gap-10">
                {pipelineSteps.map((step, i) => (
                  <PipelineNode key={i} {...step} active={activeStep >= i} />
                ))}
                {/* Connecting line behind nodes */}
                <div className="absolute left-7 top-14 -z-10 h-[calc(100%-56px)] w-[2px] bg-[hsl(0,0%,88%)]">
                  <motion.div
                    className="w-full rounded-full bg-primary"
                    style={{ height: `${lineFill * 100}%` }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Scrolling text */}
          <div className="space-y-[25vh] pb-[15vh]">
            {solutionSteps.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isActive ? 1 : 0.35 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-lg"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    Step {i + 1}
                  </p>
                  <h3 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────
   Landing Page
   ────────────────────────────────────────────── */
const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">CompensAI</span>
          </div>
          <Link to="/terms">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Stop Leaving{' '}
            <span className="bg-gradient-to-r from-primary to-[hsl(43,96%,56%)] bg-clip-text text-transparent">
              Money
            </span>{' '}
            on the Table.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Autonomous AI agents that recover unclaimed compensation for flight delays,
            damaged goods, and service failures. We fight the bureaucracy so you don't have to.
          </p>
          <Link to="/terms" className="mt-8 inline-block">
            <Button
              size="lg"
              className="gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              Start Capital Recovery
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full"
        >
          <HeroMockWindow />
        </motion.div>

        {/* Subtle radial glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
      </section>

      {/* How It Works */}
      <SolutionSection />

      {/* Pricing */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Zero Risk. Pure Performance.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              No subscriptions. No hidden fees. We take a success fee only when capital is
              recovered back to you.
            </p>

            <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-border bg-card p-10 shadow-lg shadow-primary/5">
              <div className="flex items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-5xl font-extrabold tracking-tight text-primary">10%</p>
                  <p className="text-sm text-muted-foreground">Success fee only</p>
                </div>
              </div>
            </div>

            <Link to="/dashboard" className="mt-8 inline-block">
              <Button variant="outline" size="lg" className="gap-2">
                View Live Demo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-foreground">CompensAI</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 CompensAI. Built for the Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
