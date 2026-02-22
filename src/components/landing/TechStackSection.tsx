import { motion } from 'framer-motion';
import { Zap, Bot, Database, Globe, CreditCard } from 'lucide-react';

const techCards = [
  {
    icon: Zap,
    title: 'Orchestration',
    body: 'Event-driven workflows handle email ingestion and agent pausing via n8n.',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    body: 'Multi-agent Python backend routes triage, legal drafting, and financial closing.',
  },
  {
    icon: Database,
    title: 'Real-Time State',
    body: 'Supabase powers the database, auth, and instant UI updates.',
  },
  {
    icon: Globe,
    title: 'Dynamic Execution',
    body: 'Agents parse and interact with vendor web forms autonomously.',
  },
  {
    icon: CreditCard,
    title: 'Monetization',
    body: 'Programmatic invoicing via Stripe — you only pay on success.',
  },
];

const TechStackSection = () => {
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

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {techCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md ${
                  i >= 3 ? 'sm:col-span-1 lg:col-start-auto' : ''
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
