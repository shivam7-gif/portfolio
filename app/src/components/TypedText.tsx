import { useEffect, useState } from "react";

interface TypedTextProps {
  phrases: string[];
  typingSpeed?: number;
  pause?: number;
  className?: string;
}

const TypedText = ({
  phrases,
  typingSpeed = 60,
  pause = 1400,
  className = "",
}: TypedTextProps) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), typingSpeed / 2);
    } else {
      setDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, pause]);

  return (
    <span className={className}>
      {text}
      <span className="inline-block w-[2px] h-[1em] bg-current ml-1 align-middle animate-pulse" />
    </span>
  );
};

export default TypedText;