import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bot, Database, Globe, CreditCard, ArrowRight } from 'lucide-react';

const techSteps = [
  {
    icon: Zap,
    title: 'Orchestration',
    body: 'n8n ingests emails and orchestrates agent handoffs',
    detail: 'Secure OAuth-based email monitoring triggers automated workflows. When a dispute signal is detected, n8n orchestrates the handoff between agents, pausing execution at human checkpoints.',
    color: 'hsl(43, 96%, 56%)',
    pulse: 'Email signal received...',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    body: 'Triage, legal drafting, and financial closing',
    detail: 'Three specialized agents — Triage Engine, Legal Executor, and Financial Closer — each handle a distinct phase of the pipeline. Locally hosted via Ngrok for full control.',
    color: 'hsl(20, 90%, 48%)',
    pulse: 'Drafting legal claim...',
  },
  {
    icon: Database,
    title: 'Real-Time State',
    body: 'Supabase persists every state transition instantly',
    detail: 'Every state transition is persisted to Postgres with row-level security. Realtime subscriptions push updates to the dashboard the instant an agent completes a step.',
    color: 'hsl(152, 55%, 50%)',
    pulse: 'State persisted to DB...',
  },
  {
    icon: Globe,
    title: 'Dynamic Execution',
    body: 'Agents navigate vendor portals autonomously',
    detail: 'Using browser automation, agents navigate carrier websites, fill compensation forms, and extract confirmation data — handling CAPTCHAs and dynamic content programmatically.',
    color: 'hsl(210, 80%, 50%)',
    pulse: 'Submitting to vendor...',
  },
  {
    icon: CreditCard,
    title: 'Monetization',
    body: 'Stripe invoices issued on success only',
    detail: 'When capital is recovered, the Financial Closer calculates the 10% success fee and issues a Stripe invoice automatically. Zero upfront cost, fully headless billing.',
    color: 'hsl(250, 60%, 55%)',
    pulse: 'Invoice generated ✓',
  },
];

const TechStackSection = () => {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Auto-cycle through steps when in view
  useEffect(() => {
    if (!isRunning) return;

    if (activeIdx < 0) {
      const t = setTimeout(() => setActiveIdx(0), 400);
      return () => clearTimeout(t);
    }

    if (activeIdx < techSteps.length - 1) {
      const t = setTimeout(() => setActiveIdx((i) => i + 1), 1800);
      return () => clearTimeout(t);
    }

    // Reset after completing
    const t = setTimeout(() => {
      setActiveIdx(-1);
      // Restart loop
      setTimeout(() => setActiveIdx(0), 800);
    }, 2500);
    return () => clearTimeout(t);
  }, [activeIdx, isRunning]);

  const handleInView = () => {
    if (!hasTriggered) {
      setHasTriggered(true);
      setIsRunning(true);
    }
  };

  return (
    <section className="border-y border-border bg-[hsl(0,0%,98%)] py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Built to Execute
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-base text-muted-foreground"
          >
            A fully event-driven infrastructure designed for autonomous persistence.
          </motion.p>
        </div>

        {/* Vertical pipeline */}
        <motion.div
          onViewportEnter={handleInView}
          viewport={{ once: true, margin: '-100px' }}
          className="relative mx-auto mt-16 max-w-2xl"
        >
          {/* Vertical connecting line */}
          <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-border sm:left-7">
            <motion.div
              className="w-full rounded-full bg-primary/30"
              initial={{ height: '0%' }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            {/* Active pulse traveling down the line */}
            {activeIdx >= 0 && (
              <motion.div
                className="absolute left-0 w-full rounded-full"
                style={{ backgroundColor: techSteps[Math.min(activeIdx, techSteps.length - 1)].color }}
                animate={{
                  top: `${(activeIdx / (techSteps.length - 1)) * 100}%`,
                  height: '40px',
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            )}
          </div>

          <div className="space-y-6">
            {techSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeIdx;
              const isPast = i < activeIdx;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative flex gap-5 sm:gap-6"
                >
                  {/* Node dot */}
                  <motion.div
                    animate={
                      isActive
                        ? {
                            backgroundColor: step.color,
                            borderColor: step.color,
                            boxShadow: `0 0 20px ${step.color}, 0 0 40px ${step.color}`,
                            scale: 1.15,
                          }
                        : isPast
                        ? {
                            backgroundColor: step.color,
                            borderColor: step.color,
                            boxShadow: 'none',
                            scale: 1,
                          }
                        : {
                            backgroundColor: 'hsl(0,0%,97%)',
                            borderColor: 'hsl(0,0%,85%)',
                            boxShadow: 'none',
                            scale: 1,
                          }
                    }
                    transition={{ duration: 0.4 }}
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 sm:h-14 sm:w-14"
                  >
                    <Icon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      style={{ color: isActive || isPast ? 'white' : step.color }}
                    />
                  </motion.div>

                  {/* Content card */}
                  <motion.div
                    animate={
                      isActive
                        ? {
                            borderColor: step.color + '66',
                            boxShadow: `0 4px 24px ${step.color}22`,
                          }
                        : {
                            borderColor: 'hsl(0,0%,90%)',
                            boxShadow: 'none',
                          }
                    }
                    transition={{ duration: 0.4 }}
                    className="flex-1 rounded-xl border bg-card p-5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-foreground sm:text-lg">{step.title}</h3>
                      {i < techSteps.length - 1 && (
                        <motion.div
                          animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? [0, 4, 0] : 0 }}
                          transition={isActive ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }}
                        >
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>

                    {/* Expanding detail on active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="mt-3 rounded-lg p-3 text-xs leading-relaxed"
                            style={{ backgroundColor: step.color + '0D', color: step.color }}
                          >
                            {step.detail}
                          </div>
                          {/* Status pulse */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-2 flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: step.color }}
                            />
                            <span className="text-[11px] font-medium" style={{ color: step.color }}>
                              {step.pulse}
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
