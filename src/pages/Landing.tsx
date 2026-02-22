import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Scale, Bot, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-illustration.png';
import AgentFlowVisualization from '@/components/AgentFlowVisualization';
import { useState } from 'react';

const AnimatedSection = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
};
const steps = [
  {
    icon: Mail,
    step: '1',
    title: 'Secure Monitoring',
    desc: 'Our agents connect securely to your inbox, scanning only for transactional signals like flight cancellations or delivery failures.',
  },
  {
    icon: Scale,
    step: '2',
    title: 'Legal Triage',
    desc: 'We cross-reference your situation against international regulations (like EU261) to determine legal eligibility instantly.',
  },
  {
    icon: Bot,
    step: '3',
    title: 'Autonomous Filing',
    desc: 'Our infrastructure drafts legally binding claims and navigates the vendor\'s bureaucracy on your behalf.',
  },
];

const SolutionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setScrollProgress(v);
  });

  return (
    <section ref={containerRef} className="relative min-h-[200vh]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="py-16 text-center lg:py-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            The Autonomous Advantage.
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          {/* Left: text steps */}
          <div className="space-y-[33vh] pb-[33vh]">
            {steps.map(({ icon: Icon, step, title, desc }, i) => {
              const isActive =
                scrollProgress >= i * 0.33 && scrollProgress < (i + 1) * 0.33 + 0.01;
              return (
                <div
                  key={step}
                  className={`rounded-2xl border p-8 transition-all duration-500 ${
                    isActive
                      ? 'border-primary/40 bg-card shadow-lg shadow-primary/5'
                      : 'border-border bg-card/50'
                  }`}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                    Step {step}
                  </p>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </div>
              );
            })}
          </div>

          {/* Right: sticky visualization */}
          <div className="hidden lg:block">
            <div className="sticky top-24 pt-4">
              <AgentFlowVisualization scrollProgress={scrollProgress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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

      {/* Section A: Hero */}
      <section className="relative flex min-h-screen items-center pt-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Stop Leaving Money{' '}
              <span className="text-primary">
                on the Table.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Autonomous AI agents that recover unclaimed compensation for flight delays,
              damaged goods, and service failures. We fight the bureaucracy so you don't have to.
            </p>
            <Link to="/terms" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                Start Capital Recovery
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl border border-border shadow-2xl shadow-primary/10">
              <img src={heroImage} alt="From bureaucratic chaos to recovered capital" className="w-full" />
            </div>
          </motion.div>
        </div>

        {/* Gradient orb */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </section>

      {/* Section B: Problem */}
      <AnimatedSection className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Corporate Portals Are Designed to{' '}
            <span className="text-destructive">Exhaust You.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every year, consumers forfeit billions in owed compensation. Why? Because vendor
            support loops rely on intentional friction—endless forms, confusing jargon, and
            long wait times—to protect their profit margins.
          </p>
        </div>
        {/* Maze bg */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--border)) 0px, transparent 1px, transparent 40px),
              repeating-linear-gradient(0deg, hsl(var(--border)) 0px, transparent 1px, transparent 40px)`
          }}
        />
      </AnimatedSection>

      {/* Section C: How It Works — Scroll-linked */}
      <SolutionSection />

      {/* Section D: Pricing */}
      <AnimatedSection className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Zero Risk. Pure Performance.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We don't charge subscriptions or hidden fees. We operate on a strict performance
            model: we take a <strong className="text-foreground">10% success fee</strong> only
            when capital is securely recovered back to you via Stripe. If we don't win, you don't pay.
          </p>

          <div className="mx-auto mt-12 flex max-w-sm items-center justify-center gap-6 rounded-2xl border border-border bg-card p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-4xl font-extrabold tracking-tight text-primary">10%</p>
              <p className="text-sm text-muted-foreground">Success fee only</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section E: Footer */}
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
