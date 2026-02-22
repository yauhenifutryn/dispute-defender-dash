import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Generate deterministic pseudo-random chaos paths
const generateChaosLines = (count: number) => {
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5;
    const x1 = (seed * 7.3) % 400;
    const y1 = (seed * 3.1) % 400;
    const cx1 = (seed * 11.7) % 400;
    const cy1 = (seed * 5.9) % 400;
    const cx2 = (seed * 2.3) % 400;
    const cy2 = (seed * 8.7) % 400;
    const x2 = (seed * 4.1) % 400;
    const y2 = (seed * 6.3) % 400;
    lines.push(`M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`);
  }
  return lines;
};

// Agent dot positions for each stage
const AGENT_COUNT = 8;

const generateAgentPositions = (stage: number, progress: number) => {
  const positions: { x: number; y: number; scale: number; opacity: number }[] = [];
  for (let i = 0; i < AGENT_COUNT; i++) {
    const seed = i * 47.3;
    if (stage === 0) {
      // Random bouncing outside the chaos
      const angle = (seed + progress * 360) * (Math.PI / 180);
      positions.push({
        x: 50 + Math.cos(angle + i) * (30 + (i % 3) * 15),
        y: 200 + Math.sin(angle * 1.3 + i * 0.7) * 60,
        scale: 0.6,
        opacity: 0.5,
      });
    } else if (stage === 1) {
      // Swarming from left into center
      const t = Math.min(1, progress * 2);
      const targetX = 200 + Math.cos(i * 0.8) * 30 * (1 - t);
      const targetY = 200 + Math.sin(i * 0.8) * 30 * (1 - t);
      positions.push({
        x: -20 + (targetX + 20) * t,
        y: 100 + (targetY - 100) * t,
        scale: 0.8 + t * 0.4,
        opacity: 0.7 + t * 0.3,
      });
    } else {
      // Organizing into arrow formation then shield
      const t = Math.min(1, progress * 1.5);
      const arrowX = 120 + i * 30;
      const arrowY = 200 + (i % 2 === 0 ? -1 : 1) * (i * 3) * (1 - t);
      const shieldAngle = (i / AGENT_COUNT) * Math.PI * 2;
      const shieldR = 40;
      const finalX = 300 + Math.cos(shieldAngle) * shieldR * t + arrowX * (1 - t);
      const finalY = 200 + Math.sin(shieldAngle) * shieldR * t + (arrowY - 200) * (1 - t);
      positions.push({
        x: finalX,
        y: finalY,
        scale: 1,
        opacity: 1,
      });
    }
  }
  return positions;
};

interface AgentFlowVisualizationProps {
  scrollProgress: number; // 0 to 1
}

const AgentFlowVisualization = ({ scrollProgress }: AgentFlowVisualizationProps) => {
  const chaosLines = useMemo(() => generateChaosLines(18), []);

  const stage = scrollProgress < 0.33 ? 0 : scrollProgress < 0.66 ? 1 : 2;
  const stageProgress =
    stage === 0
      ? scrollProgress / 0.33
      : stage === 1
        ? (scrollProgress - 0.33) / 0.33
        : (scrollProgress - 0.66) / 0.34;

  const clampedStageProgress = Math.max(0, Math.min(1, stageProgress));
  const agents = generateAgentPositions(stage, clampedStageProgress);

  // Chaos opacity: full at stage 0, loosening at stage 1, gone at stage 2
  const chaosOpacity =
    stage === 0 ? 0.25 : stage === 1 ? 0.25 * (1 - clampedStageProgress * 0.6) : 0.1 * (1 - clampedStageProgress);

  // Highlight strand: appears in stage 1, stays in stage 2
  const highlightOpacity = stage === 0 ? 0 : stage === 1 ? clampedStageProgress : 1;

  // Arrow / shield in stage 2
  const arrowProgress = stage === 2 ? clampedStageProgress : 0;
  const shieldProgress = stage === 2 ? Math.max(0, (clampedStageProgress - 0.5) * 2) : 0;

  // Rogue red dots (stage 0 only)
  const rogueOpacity = stage === 0 ? 0.6 : 0.6 * (1 - Math.min(1, clampedStageProgress * 3));

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-[hsl(230,25%,8%)]">
      <svg viewBox="0 0 400 400" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="agent-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strong-glow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="highlight-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(27, 95%, 60%)" />
            <stop offset="100%" stopColor="hsl(43, 96%, 56%)" />
          </linearGradient>
          <linearGradient id="arrow-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(27, 95%, 60%)" />
            <stop offset="50%" stopColor="hsl(43, 96%, 56%)" />
            <stop offset="100%" stopColor="hsl(152, 60%, 40%)" />
          </linearGradient>
        </defs>

        {/* Chaos lines */}
        <g opacity={chaosOpacity}>
          {chaosLines.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="hsl(0, 0%, 40%)"
              strokeWidth={0.8}
              strokeLinecap="round"
              style={{
                transition: 'opacity 0.4s ease',
              }}
            />
          ))}
        </g>

        {/* Highlight strand (the valid claim found) */}
        <path
          d="M40,200 C120,180 180,160 200,200 S280,240 360,200"
          fill="none"
          stroke="url(#highlight-gradient)"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={highlightOpacity}
          filter="url(#agent-glow)"
          style={{ transition: 'opacity 0.3s ease' }}
        />

        {/* Arrow forming in stage 2 */}
        {arrowProgress > 0 && (
          <g opacity={arrowProgress} style={{ transition: 'opacity 0.3s ease' }}>
            <line
              x1={60}
              y1={200}
              x2={60 + 280 * arrowProgress}
              y2={200}
              stroke="url(#arrow-gradient)"
              strokeWidth={3}
              strokeLinecap="round"
              filter="url(#agent-glow)"
            />
            {arrowProgress > 0.5 && (
              <>
                <line x1={310} y1={200} x2={290} y2={180} stroke="hsl(152, 60%, 40%)" strokeWidth={3} strokeLinecap="round" opacity={arrowProgress} filter="url(#agent-glow)" />
                <line x1={310} y1={200} x2={290} y2={220} stroke="hsl(152, 60%, 40%)" strokeWidth={3} strokeLinecap="round" opacity={arrowProgress} filter="url(#agent-glow)" />
              </>
            )}
          </g>
        )}

        {/* Shield icon at end */}
        {shieldProgress > 0 && (
          <g opacity={shieldProgress} transform="translate(300, 200)" filter="url(#strong-glow)" style={{ transition: 'opacity 0.4s ease' }}>
            <path
              d="M0,-35 C20,-35 35,-25 35,-5 C35,15 20,30 0,38 C-20,30 -35,15 -35,-5 C-35,-25 -20,-35 0,-35Z"
              fill="none"
              stroke="hsl(152, 60%, 45%)"
              strokeWidth={2}
            />
            <polyline
              points="-10,2 -3,10 12,-6"
              fill="none"
              stroke="hsl(152, 60%, 55%)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Rogue red dots (stage 0) */}
        {stage === 0 &&
          [0, 1, 2].map((i) => {
            const angle = (i * 120 + clampedStageProgress * 400) * (Math.PI / 180);
            const rx = 320 + Math.cos(angle) * 50;
            const ry = 200 + Math.sin(angle * 1.5) * 80;
            return (
              <circle
                key={`rogue-${i}`}
                cx={rx}
                cy={ry}
                r={4}
                fill="hsl(0, 70%, 55%)"
                opacity={rogueOpacity}
                filter="url(#agent-glow)"
                style={{ transition: 'cx 0.1s, cy 0.1s' }}
              />
            );
          })}

        {/* Nano-agent dots */}
        {agents.map((a, i) => (
          <g key={`agent-${i}`} filter="url(#agent-glow)">
            {/* Trail */}
            {stage >= 1 && (
              <circle
                cx={a.x - 4}
                cy={a.y + 2}
                r={3 * a.scale}
                fill="hsl(27, 95%, 60%)"
                opacity={a.opacity * 0.2}
              />
            )}
            <circle
              cx={a.x}
              cy={a.y}
              r={4 * a.scale}
              fill="hsl(27, 95%, 60%)"
              opacity={a.opacity}
            />
          </g>
        ))}
      </svg>

      {/* Corner labels */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-primary" style={{ boxShadow: '0 0 6px hsl(27, 95%, 60%)' }} />
        <span className="text-[10px] font-medium text-[hsl(0,0%,50%)]">
          {stage === 0 ? 'Scanning…' : stage === 1 ? 'Agents deployed' : 'Claim secured'}
        </span>
      </div>
    </div>
  );
};

export default AgentFlowVisualization;
