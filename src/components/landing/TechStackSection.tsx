import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Bot, Database, Globe, CreditCard } from 'lucide-react';

const techCards = [
  {
    icon: Zap,
    title: 'Orchestration',
    body: 'Event-driven workflows handle email ingestion and agent pausing via n8n.',
    detail: 'Secure OAuth-based email monitoring triggers automated workflows. When a dispute signal is detected, n8n orchestrates the handoff between agents, pausing execution at human checkpoints.',
    color: 'hsl(43, 96%, 56%)',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    body: 'Multi-agent Python backend routes triage, legal drafting, and financial closing.',
    detail: 'Three specialized agents — Triage Engine, Legal Executor, and Financial Closer — each handle a distinct phase of the pipeline. Locally hosted via Ngrok for full control.',
    color: 'hsl(20, 90%, 48%)',
  },
  {
    icon: Database,
    title: 'Real-Time State',
    body: 'Supabase powers the database, auth, and instant UI updates.',
    detail: 'Every state transition is persisted to Postgres with row-level security. Realtime subscriptions push updates to the dashboard the instant an agent completes a step.',
    color: 'hsl(152, 55%, 50%)',
  },
  {
    icon: Globe,
    title: 'Dynamic Execution',
    body: 'Agents parse and interact with vendor web forms autonomously.',
    detail: 'Using browser automation, agents navigate carrier websites, fill compensation forms, and extract confirmation data — handling CAPTCHAs and dynamic content programmatically.',
    color: 'hsl(210, 80%, 50%)',
  },
  {
    icon: CreditCard,
    title: 'Monetization',
    body: 'Programmatic invoicing via Stripe — you only pay on success.',
    detail: 'When capital is recovered, the Financial Closer calculates the 10% success fee and issues a Stripe invoice automatically. Zero upfront cost, fully headless billing.',
    color: 'hsl(250, 60%, 55%)',
  },
];

const TechStackSection = () => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <section className="border-y border-border bg-[hsl(0,0%,98%)] py-24 lg:py-32">
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

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {techCards.map((card, i) => {
            const Icon = card.icon;
            const isExpanded = expandedIdx === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setExpandedIdx(isExpanded ? null : i)}
                className={`group cursor-pointer rounded-2xl border bg-card p-7 shadow-sm transition-all duration-300 ${
                  isExpanded
                    ? 'border-primary/40 shadow-md shadow-primary/10 scale-[1.02]'
                    : 'border-border hover:shadow-md hover:border-primary/20 hover:scale-[1.01]'
                }`}
                style={isExpanded ? { borderColor: card.color + '66' } : undefined}
              >
                <div className="flex items-start justify-between">
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: card.color + '18' }}
                  >
                    <Icon className="h-6 w-6" style={{ color: card.color }} />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    className="mt-1 text-xs text-muted-foreground"
                  >
                    +
                  </motion.div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-3 rounded-lg p-3 text-xs leading-relaxed"
                        style={{ backgroundColor: card.color + '0D', color: card.color }}
                      >
                        {card.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
