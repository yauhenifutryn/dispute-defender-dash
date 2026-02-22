import { motion } from 'framer-motion';
import { Mail, Scale, CheckCircle2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pipelineSteps = [
  { icon: Mail, label: 'Signal Detected', desc: 'Agent captures a dispute signal from your inbox' },
  { icon: Scale, label: 'Claim Drafted', desc: 'Legal claim auto-generated against regulations' },
  { icon: CheckCircle2, label: 'You Approve', desc: 'System pauses — you review and decide', highlight: true },
  { icon: Bot, label: 'Claim Filed', desc: 'Agent resumes and submits to the vendor' },
];

const HITLSection = () => {
  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            You Stay in Control
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground"
          >
            We enforce a strict Human-in-the-Loop architecture. No claim fires without your explicit approval.
          </motion.p>
        </div>

        {/* Horizontal pipeline — stacks vertically on mobile */}
        <div className="relative mt-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-0 right-0 top-7 hidden h-[2px] bg-border sm:block">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: '0%' }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Node */}
                  <motion.div
                    whileInView={
                      step.highlight
                        ? {
                            boxShadow: '0 0 24px hsl(20, 90%, 48%), 0 0 48px hsl(20, 90%, 48%)',
                            backgroundColor: 'hsl(20, 90%, 48%)',
                            borderColor: 'hsl(20, 90%, 48%)',
                          }
                        : {
                            borderColor: 'hsl(20, 90%, 48%)',
                          }
                    }
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.15 + 0.2 }}
                    className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-card"
                  >
                    <Icon
                      className={`h-6 w-6 ${step.highlight ? 'text-primary-foreground' : 'text-primary'}`}
                    />
                  </motion.div>

                  <p className="mt-4 text-sm font-bold text-foreground">{step.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground max-w-[180px]">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Mock approval card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-12 max-w-sm"
          >
            <motion.div
              animate={{ boxShadow: ['0 0 0px hsl(20,90%,48%)', '0 0 20px hsl(20,90%,48%)', '0 0 0px hsl(20,90%,48%)'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-2xl border border-border bg-card p-6 shadow-lg"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Awaiting Your Decision
              </p>
              <p className="mt-2 text-sm text-foreground font-medium">
                Claim: Flight HA1234 — €400 under EU261
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drafted claim ready for review. No action will be taken until you decide.
              </p>
              <div className="mt-4 flex gap-3">
                <Button size="sm" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Reject
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HITLSection;
