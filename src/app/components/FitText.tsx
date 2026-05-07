'use client';

import { useEffect, useRef, useState } from 'react';

interface FitTextProps {
  text: string;
  fontFamily?: string;
  fontWeight?: string;
  className?: string;
  color?: string;
}

function splitIntoLines(words: string[]): string[] {
  if (words.length === 1) return [words[0]];
  // If first word is more than 5 chars, it gets its own line
  if (words[0].length > 5) {
    return [words[0], words.slice(1).join(' ')];
  }
  if (words.length === 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  targetWidth: number,
  fontFamily: string,
  fontWeight: string
): number {
  let lo = 1, hi = 400, best = 12;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    ctx.font = `${fontWeight} ${mid}px ${fontFamily}`;
    const measured = ctx.measureText(text).width;
    if (measured <= targetWidth) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

export default function FitText({
  text,
  fontFamily = 'Coolvetica, sans-serif',
  fontWeight = '400',
  className = '',
  color = 'white',
}: FitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ text: string; fontSize: number }[]>([]);

  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      if (width === 0) return;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const words = text.trim().split(/\s+/);
      const lineGroups = splitIntoLines(words);

      const result = lineGroups.map((line) => ({
        text: line,
        fontSize: fitFontSize(ctx, line, width, fontFamily, fontWeight),
      }));

      setLines(result);
    };

    calculate();

    const observer = new ResizeObserver(calculate);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [text, fontFamily, fontWeight]);

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            fontSize: `${line.fontSize}px`,
            fontFamily,
            fontWeight,
            color,
            lineHeight: 0.95,
            display: 'block',
            whiteSpace: 'nowrap',
          }}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}