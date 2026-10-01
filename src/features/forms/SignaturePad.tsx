"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState, type PointerEvent, type Ref } from "react";
import { TextInput } from "@/components/ui/Field";
import { cn } from "@/lib/cn";

export type SignaturePadHandle = {
  /** A transparent PNG data URL of the signature, or null if nothing has been signed. */
  toDataURL(): string | null;
  clear(): void;
};

type Point = { x: number; y: number };

const HEIGHT = 160;
const INK = "#0b303b";
const LINE_WIDTH = 2.6;
const SCRIPT_FONT = '"Snell Roundhand", "Segoe Script", "Brush Script MT", "Lucida Handwriting", cursive';

type SignaturePadProps = {
  /** Names the box for screen readers, e.g. "Participant signature". */
  label: string;
  /** Used to prefill the typed signature. */
  suggestedName?: string;
  onChange?: (hasSignature: boolean) => void;
  ref?: Ref<SignaturePadHandle>;
};

/**
 * A signature box: draw with a finger, stylus or mouse, or type a name instead.
 *
 * The typed mode is not a convenience — drawing cannot be done from a keyboard,
 * so it is the way for someone who cannot draw to sign. Both produce the same
 * thing: a PNG that is transparent where there is no ink.
 *
 * Strokes are kept in units of the pad's height, not pixels, so rotating a phone
 * or resizing the window redraws the same signature at the same size rather than
 * wiping it or stretching it.
 */
export function SignaturePad({ label, suggestedName = "", onChange, ref }: SignaturePadProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Point[][]>([]);
  const drawing = useRef(false);

  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typed, setTyped] = useState("");
  const [signed, setSigned] = useState(false);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const scale = canvas.height / HEIGHT;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = INK;
    context.fillStyle = INK;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = LINE_WIDTH * scale;

    if (mode === "type") {
      const text = typed.trim();
      if (!text) return;
      let size = HEIGHT * 0.46 * scale;
      context.font = `italic ${size}px ${SCRIPT_FONT}`;
      const maxWidth = canvas.width * 0.9;
      const measured = context.measureText(text).width;
      if (measured > maxWidth) {
        size *= maxWidth / measured;
        context.font = `italic ${size}px ${SCRIPT_FONT}`;
      }
      context.textBaseline = "alphabetic";
      context.fillText(text, canvas.width * 0.05, HEIGHT * 0.66 * scale);
      return;
    }

    for (const stroke of strokes.current) {
      const pts = stroke.map((p) => ({ x: p.x * HEIGHT * scale, y: p.y * HEIGHT * scale }));
      if (pts.length === 1) {
        context.beginPath();
        context.arc(pts[0].x, pts[0].y, (LINE_WIDTH * scale) / 2, 0, Math.PI * 2);
        context.fill();
        continue;
      }
      context.beginPath();
      context.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i += 1) {
        const midX = (pts[i].x + pts[i + 1].x) / 2;
        const midY = (pts[i].y + pts[i + 1].y) / 2;
        context.quadraticCurveTo(pts[i].x, pts[i].y, midX, midY);
      }
      context.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      context.stroke();
    }
  }, [mode, typed]);

  // Match the canvas's pixel size to its on-screen size, sharply on dense screens.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(wrapper.clientWidth, 120);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(HEIGHT * dpr);
      paint();
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [paint]);

  useEffect(() => paint(), [paint]);

  const update = useCallback(
    (hasSignature: boolean) => {
      setSigned(hasSignature);
      onChange?.(hasSignature);
    },
    [onChange]
  );

  const clear = useCallback(() => {
    strokes.current = [];
    setTyped("");
    paint();
    update(false);
  }, [paint, update]);

  useImperativeHandle(
    ref,
    () => ({
      toDataURL() {
        const hasInk = mode === "type" ? typed.trim().length > 0 : strokes.current.length > 0;
        return hasInk ? (canvasRef.current?.toDataURL("image/png") ?? null) : null;
      },
      clear
    }),
    [mode, typed, clear]
  );

  const point = (event: PointerEvent<HTMLCanvasElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) / HEIGHT, y: (event.clientY - rect.top) / HEIGHT };
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (mode !== "draw") return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    strokes.current.push([point(event)]);
    paint();
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    strokes.current[strokes.current.length - 1].push(point(event));
    paint();
  };

  const endStroke = () => {
    if (!drawing.current) return;
    drawing.current = false;
    update(strokes.current.length > 0);
  };

  const switchMode = () => {
    strokes.current = [];
    const next = mode === "draw" ? "type" : "draw";
    setMode(next);
    setTyped(next === "type" ? suggestedName : "");
    update(next === "type" && suggestedName.trim().length > 0);
  };

  return (
    <div role="group" aria-label={label}>
      <div
        ref={wrapperRef}
        className={cn(
          "relative overflow-hidden rounded-lg border bg-surface",
          signed ? "border-line" : "border-ink/30 border-dashed"
        )}
        style={{ height: HEIGHT }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 size-full"
          style={{ touchAction: "none", cursor: mode === "draw" ? "crosshair" : "default" }}
          aria-label={
            mode === "draw"
              ? `${label}. Draw your signature here with your finger or mouse, or use the button below to type it instead.`
              : `${label}. Preview of your typed signature.`
          }
          role="img"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
        {!signed && mode === "draw" ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-ink-subtle"
          >
            Sign here
          </span>
        ) : null}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 bottom-9 border-b border-ink/25" />
      </div>

      {mode === "type" ? (
        <div className="mt-3">
          <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor={`${label}-typed`}>
            Type your full name
          </label>
          <TextInput
            id={`${label}-typed`}
            value={typed}
            autoComplete="off"
            onChange={(event) => {
              setTyped(event.target.value);
              update(event.target.value.trim().length > 0);
            }}
          />
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <button
          type="button"
          onClick={clear}
          disabled={!signed}
          className="font-medium text-brand-deep underline underline-offset-2 disabled:text-ink-subtle disabled:no-underline"
        >
          Clear
        </button>
        <button type="button" onClick={switchMode} className="font-medium text-brand-deep underline underline-offset-2">
          {mode === "draw" ? "Type my signature instead" : "Draw my signature instead"}
        </button>
      </div>
    </div>
  );
}
