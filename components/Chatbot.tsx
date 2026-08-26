"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hey, I am the FIVEO assistant. Ask me about services, pricing, or how to get started.",
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest("[data-chatbot-trigger]")) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
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

  return (
    <div className="relative">
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

      <div
        id="fiveo-chatbot-panel"
        ref={panelRef}
        className={`absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(92vw,360px)] origin-top-right transition-[opacity,transform] duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-fg)_18%,transparent)] bg-[var(--color-bg)] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-3 border-b border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] px-4 py-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[color-mix(in_srgb,var(--color-fg)_20%,transparent)]">
              <Image
                src="/images/chatbot-avatar.jpg"
                alt=""
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[14px] font-semibold tracking-[-0.02em] text-[var(--color-fg)]">
                FIVEO Assistant
              </p>
              <p className="text-[12px] text-[var(--color-fg)]/55">
                Ask about services and pricing
              </p>
            </div>
          </div>

          <div
            ref={messagesRef}
            className="flex max-h-[min(52vh,420px)] flex-col gap-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-[1.45] ${
                  message.role === "user"
                    ? "ml-auto bg-[var(--color-fg)] text-[var(--color-bg)]"
                    : "mr-auto border border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] bg-[var(--color-surface-muted)] text-[var(--color-fg)]"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading ? (
              <div className="mr-auto rounded-2xl border border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-[14px] text-[var(--color-fg)]/55">
                Thinking...
              </div>
            ) : null}
          </div>

          <form
            className="border-t border-[color-mix(in_srgb,var(--color-fg)_12%,transparent)] p-3"
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
        </div>
      </div>
    </div>
  );
}
