import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Mail, Scale, Bot, Shield, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-illustration.png';

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

const Landing = () => {
  return (
    <div className="min-h-screen bg-[hsl(230,25%,7%)] text-[hsl(0,0%,95%)]">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-[hsl(230,20%,15%)] bg-[hsl(230,25%,7%)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(230,80%,60%)]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">ClearClaim</span>
          </div>
          <Link to="/terms">
            <Button size="sm" className="bg-[hsl(230,80%,55%)] text-white hover:bg-[hsl(230,80%,48%)]">
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
              <span className="bg-gradient-to-r from-[hsl(230,80%,65%)] to-[hsl(260,80%,70%)] bg-clip-text text-transparent">
                on the Table.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[hsl(230,10%,60%)]">
              Autonomous AI agents that recover unclaimed compensation for flight delays,
              damaged goods, and service failures. We fight the bureaucracy so you don't have to.
            </p>
            <Link to="/terms" className="mt-8 inline-block">
              <Button size="lg" className="gap-2 bg-[hsl(230,80%,55%)] px-8 text-base font-semibold text-white hover:bg-[hsl(230,80%,48%)]">
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
            <div className="overflow-hidden rounded-2xl border border-[hsl(230,20%,18%)] shadow-2xl shadow-[hsl(230,80%,55%)]/10">
              <img src={heroImage} alt="From bureaucratic chaos to recovered capital" className="w-full" />
            </div>
          </motion.div>
        </div>

        {/* Gradient orb */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(230,80%,55%)]/5 blur-3xl" />
      </section>

      {/* Section B: Problem */}
      <AnimatedSection className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Corporate Portals Are Designed to{' '}
            <span className="text-[hsl(0,70%,55%)]">Exhaust You.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(230,10%,55%)]">
            Every year, consumers forfeit billions in owed compensation. Why? Because vendor
            support loops rely on intentional friction—endless forms, confusing jargon, and
            long wait times—to protect their profit margins.
          </p>
        </div>
        {/* Maze bg */}
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, hsl(230,20%,40%) 0px, transparent 1px, transparent 40px),
              repeating-linear-gradient(0deg, hsl(230,20%,40%) 0px, transparent 1px, transparent 40px)`
          }}
        />
      </AnimatedSection>

      {/* Section C: How It Works */}
      <AnimatedSection className="py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            The Autonomous Advantage.
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
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
            ].map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="group rounded-2xl border border-[hsl(230,20%,15%)] bg-[hsl(230,25%,10%)] p-8 transition-colors hover:border-[hsl(230,80%,55%)]/30"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(230,80%,55%)]/10">
                  <Icon className="h-6 w-6 text-[hsl(230,80%,65%)]" />
                </div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[hsl(230,80%,65%)]">
                  Step {step}
                </p>
                <h3 className="mb-3 text-xl font-bold">{title}</h3>
                <p className="text-sm leading-relaxed text-[hsl(230,10%,55%)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Section D: Pricing */}
      <AnimatedSection className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Zero Risk. Pure Performance.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[hsl(230,10%,55%)]">
            We don't charge subscriptions or hidden fees. We operate on a strict performance
            model: we take a <strong className="text-[hsl(0,0%,95%)]">10% success fee</strong> only
            when capital is securely recovered back to you via Stripe. If we don't win, you don't pay.
          </p>

          <div className="mx-auto mt-12 flex max-w-sm items-center justify-center gap-6 rounded-2xl border border-[hsl(230,20%,15%)] bg-[hsl(230,25%,10%)] p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[hsl(260,80%,55%)]/10">
              <Shield className="h-8 w-8 text-[hsl(260,80%,70%)]" />
            </div>
            <div className="text-left">
              <p className="text-4xl font-extrabold tracking-tight text-[hsl(230,80%,65%)]">10%</p>
              <p className="text-sm text-[hsl(230,10%,55%)]">Success fee only</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section E: Footer */}
      <footer className="border-t border-[hsl(230,20%,15%)] py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[hsl(230,80%,65%)]" />
            <span className="text-sm font-bold">ClearClaim</span>
          </div>
          <p className="text-xs text-[hsl(230,10%,45%)]">
            © 2026 ClearClaim AI. Built for the Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
