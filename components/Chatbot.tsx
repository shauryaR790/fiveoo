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

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, loading, open]);

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
        { role: "assistant", content: data.reply! },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const panel =
    mounted
      ? createPortal(
          <div
            className={`fixed inset-0 z-[200] flex ${
              open ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!open}
          >
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className={`min-w-0 flex-1 bg-black/40 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500 ${
                open ? "opacity-100" : "opacity-0"
              }`}
            />

            <aside
              id="fiveo-chatbot-panel"
              className={`flex h-dvh w-[min(100%,420px)] shrink-0 flex-col border-l border-[color-mix(in_srgb,var(--color-fg)_14%,transparent)] bg-[var(--color-bg)] shadow-[-24px_0_80px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] py-4 pl-3 pr-5 md:pl-4">
                <FiveoMark className="-ml-1 h-10 md:-ml-2 md:h-11" />
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
                        {message.content}
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
                    <div className="rounded-2xl border border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-[14px] text-[var(--color-fg)]/55">
                      Thinking...
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
                    disabled={loading || !input.trim()}
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
        onClick={() => setOpen((value) => !value)}
        className="relative z-50 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--color-fg)_22%,transparent)] bg-[var(--color-bg)] p-0.5 transition-[border-color,transform] duration-300 hover:border-[color-mix(in_srgb,var(--color-fg)_38%,transparent)] hover:scale-[1.03]"
      >
        <Image
          src="/images/chatbot-avatar.jpg"
          alt=""
          width={36}
          height={36}
          className="h-full w-full rounded-full object-cover"
        />
      </button>

      {panel}
    </>
  );
}
