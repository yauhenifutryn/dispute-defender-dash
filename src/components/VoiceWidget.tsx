import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Loader2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

interface VoiceWidgetProps {
  /** Text to read aloud. If not provided, reads visible page content. */
  text?: string;
  /** Optional label shown on hover */
  label?: string;
}

const VoiceWidget = ({ text, label = 'Read aloud' }: VoiceWidgetProps) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus('idle');
  }, []);

  const getPageText = (): string => {
    if (text) return text;
    // Grab visible main content
    const main = document.querySelector('main');
    if (!main) return '';
    const clone = main.cloneNode(true) as HTMLElement;
    // Remove buttons, scripts, styles
    clone.querySelectorAll('button, script, style, svg, [aria-hidden]').forEach(el => el.remove());
    const raw = clone.innerText || clone.textContent || '';
    // Clean up whitespace
    return raw.replace(/\s+/g, ' ').trim().slice(0, 3500);
  };

  const play = useCallback(async () => {
    if (status === 'playing' || status === 'loading') {
      stop();
      return;
    }

    const content = getPageText();
    if (!content) {
      toast.error('Nothing to read on this page.');
      return;
    }

    setStatus('loading');
    abortRef.current = new AbortController();

    try {
      const resp = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: content }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.error || `TTS failed (${resp.status})`);
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setStatus('idle');
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setStatus('idle');
        toast.error('Audio playback failed.');
      };

      setStatus('playing');
      await audio.play();
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      console.error('TTS error:', err);
      toast.error(err instanceof Error ? err.message : 'Voice playback failed.');
      setStatus('idle');
    }
  }, [status, text, stop]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <Button
        onClick={play}
        size="icon"
        className={cn(
          'h-12 w-12 rounded-full shadow-lg transition-all',
          status === 'playing'
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : status === 'loading'
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        )}
        title={label}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : status === 'playing' ? (
          <Square className="h-4 w-4" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
      {status === 'playing' && (
        <span className="rounded-md bg-card px-2 py-1 text-xs font-medium text-foreground shadow-sm border border-border">
          Speaking…
        </span>
      )}
    </div>
  );
};

export default VoiceWidget;
