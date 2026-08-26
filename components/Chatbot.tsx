"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import FiveoMark from "@/components/FiveoMark";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hey, I am the FIVEO assistant.",
};

const THINKING_PHRASES = [
  "Thinking...",
  "Looking that up...",
  "One moment...",
  "Pulling details...",
  "Almost there...",
];

function BotAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const dimension = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <div
      className={`relative ${dimension} shrink-0 overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--color-fg)_20%,transparent)]`}
    >
      <Image
        src="/images/chatbot-avatar.jpg"
        alt=""
        fill
        sizes={size === "sm" ? "28px" : "36px"}
        className="object-cover"
      />
    </div>
  );
}

function ThinkingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setPhraseIndex((current) => (current + 1) % THINKING_PHRASES.length);
        setVisible(true);
      }, 180);
    }, 1400);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-block min-w-[9.5rem] transition-opacity duration-200 ${
        visible ? "opacity-55" : "opacity-0"
      }`}
    >
      {THINKING_PHRASES[phraseIndex]}
    </span>
  );
}

function TypingAssistantText({
  text,
  active,
  onTick,
  onComplete,
}: {
  text: string;
  active: boolean;
  onTick?: () => void;
  onComplete?: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(active ? 0 : Infinity);

  useEffect(() => {
    if (!active) {
      setVisibleCount(Infinity);
      return;
    }

    setVisibleCount(0);
    let index = 0;
    const tokens = text.match(/\S+\s*/g) ?? (text ? [text] : []);

    if (tokens.length === 0) {
      onComplete?.();
      return;
    }

    const interval = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);
      onTick?.();

      if (index >= tokens.length) {
        window.clearInterval(interval);
        onComplete?.();
      }
    }, 42);

    return () => window.clearInterval(interval);
  }, [active, text]);

  if (!active) {
    return <>{text}</>;
  }

  const tokens = text.match(/\S+\s*/g) ?? (text ? [text] : []);
  const visible = Number.isFinite(visibleCount)
    ? tokens.slice(0, visibleCount).join("")
    : text;

  return (
    <>
      {visible}
      {visibleCount < tokens.length ? (
        <span className="ml-0.5 inline-block h-[1.05em] w-[0.45em] animate-pulse bg-[var(--color-fg)]/45 align-[-0.05em]" />
      ) : null}
    </>
  );
}

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [typingMessageIndex, setTypingMessageIndex] = useState<number | null>(
    null,
  );
  const [backdropBlur, setBackdropBlur] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setBackdropBlur(true);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = backdropBlur ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, backdropBlur]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, open, typingMessageIndex]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setTypingMessageIndex(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(1),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error ?? "Unable to get a response.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant" as const, content: data.reply! },
      ]);
      setTypingMessageIndex(nextMessages.length);
    } catch (error) {
      const errorContent =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setMessages((current) => [
        ...current,
        { role: "assistant" as const, content: errorContent },
      ]);
      setTypingMessageIndex(nextMessages.length);
    } finally {
      setLoading(false);
    }
  };

  const panel =
    mounted
      ? createPortal(
          <div
            className={`fixed inset-0 z-[200] ${
              open
                ? backdropBlur
                  ? "pointer-events-auto"
                  : "pointer-events-none"
                : "pointer-events-none"
            }`}
            aria-hidden={!open}
          >
            <div
              aria-hidden
              className={`absolute inset-0 transition-[background-color,backdrop-filter,opacity] duration-500 ${
                open && backdropBlur
                  ? "bg-black/40 opacity-100 backdrop-blur-xl backdrop-saturate-150"
                  : "bg-transparent opacity-0 backdrop-blur-none"
              }`}
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setBackdropBlur((value) => !value);
              }}
              aria-label={backdropBlur ? "Hide background blur" : "Show background blur"}
              aria-pressed={backdropBlur}
              tabIndex={open ? 0 : -1}
              className={`fixed left-5 top-1/2 z-[201] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-fg)_20%,transparent)] bg-[var(--color-bg)]/90 text-[var(--color-fg)] shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-md transition-[opacity,transform,border-color] duration-300 hover:border-[color-mix(in_srgb,var(--color-fg)_34%,transparent)] hover:scale-[1.03] md:left-8 ${
                open
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : "pointer-events-none -translate-x-2 opacity-0"
              }`}
            >
              {backdropBlur ? (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M1.5 9s2.8-5.25 7.5-5.25S16.5 9 16.5 9s-2.8 5.25-7.5 5.25S1.5 9 1.5 9Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M3 15L15 3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path
                    d="M1.5 9s2.8-5.25 7.5-5.25S16.5 9 16.5 9s-2.8 5.25-7.5 5.25S1.5 9 1.5 9Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <circle cx="9" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              )}
            </button>

            <aside
              id="fiveo-chatbot-panel"
              className={`fixed right-0 top-0 flex h-dvh w-[min(100%,420px)] flex-col border-l border-[color-mix(in_srgb,var(--color-fg)_14%,transparent)] bg-[var(--color-bg)] shadow-[-24px_0_80px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open
                  ? "pointer-events-auto translate-x-0"
                  : "pointer-events-none translate-x-full"
              }`}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] py-4 pl-1 pr-5 md:pl-2">
                <FiveoMark className="h-10 md:h-11" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat panel"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--color-fg)_16%,transparent)] text-[var(--color-fg)]/70 transition-colors hover:border-[color-mix(in_srgb,var(--color-fg)_30%,transparent)] hover:text-[var(--color-fg)]"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M2 2l10 10M12 2 2 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div
                ref={messagesRef}
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
              >
                {messages.map((message, index) =>
                  message.role === "assistant" ? (
                    <div
                      key={`${message.role}-${index}`}
                      className="mr-auto flex max-w-[92%] items-end gap-2.5"
                    >
                      <BotAvatar size="sm" />
                      <div className="rounded-2xl border border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-[14px] leading-[1.45] text-[var(--color-fg)]">
                        <TypingAssistantText
                          text={message.content}
                          active={typingMessageIndex === index}
                          onTick={scrollToBottom}
                          onComplete={() => setTypingMessageIndex(null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      key={`${message.role}-${index}`}
                      className="ml-auto max-w-[88%] rounded-2xl bg-[var(--color-fg)] px-3.5 py-2.5 text-[14px] leading-[1.45] text-[var(--color-bg)]"
                    >
                      {message.content}
                    </div>
                  ),
                )}

                {loading ? (
                  <div className="mr-auto flex max-w-[92%] items-end gap-2.5">
                    <BotAvatar size="sm" />
                    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-[14px] text-[var(--color-fg)]">
                      <ThinkingIndicator />
                    </div>
                  </div>
                ) : null}
              </div>

              <form
                className="shrink-0 border-t border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] p-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage();
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask anything..."
                    aria-label="Chat message"
                    className="min-w-0 flex-1 rounded-full border border-[color-mix(in_srgb,var(--color-fg)_16%,transparent)] bg-transparent px-4 py-2.5 text-[14px] text-[var(--color-fg)] outline-none placeholder:text-[var(--color-fg)]/40 focus:border-[color-mix(in_srgb,var(--color-fg)_32%,transparent)]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim() || typingMessageIndex !== null}
                    className="rounded-full bg-[var(--color-fg)] px-4 py-2.5 text-[13px] font-semibold text-[var(--color-bg)] transition-opacity disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
              </form>
            </aside>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        data-chatbot-trigger
        aria-expanded={open}
        aria-controls="fiveo-chatbot-panel"
        aria-label={open ? "Close chat" : "Open chat"}
        onClick={() => {
          if (open && !backdropBlur) return;
          setOpen((value) => !value);
        }}
        className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-[color-mix(in_srgb,var(--color-fg)_22%,transparent)] bg-[var(--color-bg)] p-0.5 transition-[border-color,transform] duration-300 hover:border-[color-mix(in_srgb,var(--color-fg)_38%,transparent)] hover:scale-[1.03]"
      >
        <Image
          src="/images/chatbot-avatar.jpg"
          alt=""
          width={36}
          height={36}
          className="h-full w-full rounded-[9px] object-cover"
        />
      </button>

      {panel}
    </>
  );
}
