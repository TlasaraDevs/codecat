import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// "codecaT_" wordmark: "code" in red, "ca" in paper, then the Tlasara "T"
// wearing cat ears (left ear red), then a red underscore cursor.

const LETTERS = [
  { char: "c", className: "text-red" },
  { char: "o", className: "text-red" },
  { char: "d", className: "text-red" },
  { char: "e", className: "text-red" },
  { char: "c", className: "text-paper" },
  { char: "a", className: "text-paper" },
];
const TYPED_ALL = LETTERS.length;
const T_SHOWN = TYPED_ALL + 1;

const INTRO_MS = 1590; // three blinks of the cursor before typing starts
const BLINK_INTRO = "530ms";
const LETTER_MS = 90;
const T_DELAY_MS = 120;
const T_POP_MS = 600;

// Shapes copied from the repo-root public/tlasara-T-dark.svg (viewBox cropped
// to the glyph: x 24–78, y 10–92). The T body is 60 units tall, which we size
// to Inter's cap height (~0.727em), so the whole glyph is 82 units ≈ 0.994em.
const T_VIEWBOX = "24 10 54 82";
const LEFT_EAR = "24,33 24,10 43,33";
const RIGHT_EAR = "78,33 78,10 59,33";
const T_STYLE = { width: "0.654em", height: "0.994em", marginLeft: "0.04em" };

const EarsAndT = ({ animate }) => {
  const Svg = animate ? m.svg : "svg";
  const G = animate ? m.g : "g";
  const pop = (delay) =>
    animate && {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { type: "spring", stiffness: 500, damping: 18, delay },
    };
  return (
    <Svg viewBox={T_VIEWBOX} aria-hidden="true" className="inline-block" style={T_STYLE} {...pop(0)}>
      <G style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} {...pop(0.15)}>
        <polygon className="fill-red" points={LEFT_EAR} />
        <polygon className="fill-paper" points={RIGHT_EAR} />
      </G>
      <rect className="fill-paper" x="24" y="32" width="54" height="14" />
      <rect className="fill-paper" x="44" y="45" width="14" height="47" />
    </Svg>
  );
};

// Underscore cursor sitting on the baseline.
const Cursor = ({ blink, style, className = "" }) => (
  <span
    aria-hidden="true"
    className={`inline-block bg-red ${blink ? "animate-blink" : ""} ${className}`}
    style={{ width: "0.5em", height: "0.12em", ...style }}
  />
);

const WORDMARK = "inline-flex items-baseline font-sans text-[1.65rem] font-black leading-none tracking-[-0.03em] md:text-[1.85rem]";

// The finished logo, without animation.
export const LogoStatic = ({ className = "" }) => (
  <span className={`${WORDMARK} ${className}`}>
    <span aria-hidden="true" className="inline-flex items-baseline">
      {LETTERS.map((l, i) => (
        <span key={i} className={l.className}>
          {l.char}
        </span>
      ))}
      <EarsAndT />
      <Cursor style={{ marginLeft: "0.08em" }} />
    </span>
  </span>
);

// Animated logo: cursor blinks, types "codeca", the eared T pops in, and the
// cursor keeps blinking. Every glyph is always in the layout (only its
// opacity changes), so the final width is reserved from the first frame.
// Call ref.current.replay() to play it again (ignored while playing).
export const Logo = ({ className = "", ref }) => {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro | typing | done
  const timers = useRef([]);
  const playing = useRef(false);

  const play = useCallback(() => {
    if (playing.current) return;
    playing.current = true;
    timers.current.forEach(clearTimeout);
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));

    setTyped(0);
    setPhase("intro");
    at(INTRO_MS, () => setPhase("typing"));
    for (let i = 1; i <= TYPED_ALL; i++) at(INTRO_MS + i * LETTER_MS, () => setTyped(i));
    const tAt = INTRO_MS + TYPED_ALL * LETTER_MS + T_DELAY_MS;
    at(tAt, () => {
      setTyped(T_SHOWN);
      setPhase("done");
    });
    at(tAt + T_POP_MS, () => {
      playing.current = false;
    });
  }, []);

  useImperativeHandle(ref, () => ({ replay: () => !reduced && play() }), [reduced, play]);

  useEffect(() => {
    if (!reduced) play();
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      playing.current = false;
    };
  }, [reduced, play]);

  if (reduced) return <LogoStatic className={className} />;

  // While typing, a zero-width cursor sits after the last typed letter (or
  // before the first during the intro blinks); zero width = no layout shift.
  const ghostCursor = (
    <span className="inline-block w-0 whitespace-nowrap">
      <Cursor
        blink={phase === "intro"}
        style={{ animationDuration: phase === "intro" ? BLINK_INTRO : undefined }}
      />
    </span>
  );
  const cursorAfter = phase === "intro" ? -1 : typed - 1;

  return (
    <span className={`${WORDMARK} ${className}`}>
      <span aria-hidden="true" className="inline-flex items-baseline">
        {phase !== "done" && cursorAfter === -1 && ghostCursor}
        {LETTERS.map((l, i) => (
          <span key={i} className="inline-flex items-baseline">
            <span className={`${l.className} ${i < typed ? "opacity-100" : "opacity-0"}`}>{l.char}</span>
            {phase !== "done" && cursorAfter === i && ghostCursor}
          </span>
        ))}
        {typed >= T_SHOWN ? (
          <EarsAndT animate />
        ) : (
          <span className="inline-block" style={T_STYLE} />
        )}
        <Cursor blink style={{ marginLeft: "0.08em", opacity: phase === "done" ? 1 : 0 }} />
      </span>
    </span>
  );
};
