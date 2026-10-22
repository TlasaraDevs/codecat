import { useEffect, useState } from "react";

// Types each word, pauses, deletes it, then moves on to the next.
export const useTypewriter = (words, { typeMs = 70, deleteMs = 35, pauseMs = 1600, enabled = true } = {}) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled || words.length === 0) return;
    const word = words[index % words.length];

    let delay = deleting ? deleteMs : typeMs;
    if (!deleting && text === word) delay = pauseMs;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [words, index, text, deleting, enabled, typeMs, deleteMs, pauseMs]);

  return text;
};
