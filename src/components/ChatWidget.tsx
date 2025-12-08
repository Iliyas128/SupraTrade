import { useEffect, useMemo, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  id: string;
  role: "system" | "user";
  text: string;
};

const ChatWidget = () => {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL ?? "";

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      text: "Здравствуйте! 👋 Я AI-ассистент SUPRA TRADE. Чем могу помочь?",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // generate or reuse session id for n8n session tracking
  useEffect(() => {
    const key = "chat-widget-session-id";
    let existing = localStorage.getItem(key);
    if (!existing) {
      existing = crypto.randomUUID();
      localStorage.setItem(key, existing);
    }
    setSessionId(existing);
  }, []);

  const isWebhookConfigured = useMemo(() => Boolean(webhookUrl), [webhookUrl]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text || isSending) return;
    if (!sessionId) {
      setError("SessionId не инициализирован, обновите страницу");
      return;
    }

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);
    setError(null);

    if (!isWebhookConfigured) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: "Webhook не настроен. Добавьте VITE_N8N_WEBHOOK_URL." },
      ]);
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatInput: text,
          source: "chat-widget",
          pageUrl: window.location.href,
          sessionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Webhook responded with ${res.status}`);
      }

      let botText = "Спасибо! Сообщение отправлено, скоро свяжемся.";
      try {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          const candidate =
            data?.output ??
            data?.message ??
            data?.botResponse ??
            data?.answer ??
            data?.data?.output ??
            data?.data?.message;
          if (typeof candidate === "string" && candidate.trim()) {
            botText = candidate.trim();
          }
        } else {
          const textBody = (await res.text())?.trim();
          if (textBody) botText = textBody;
        }
      } catch {
        // ignore parse errors, keep default botText
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: botText },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить сообщение");
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "system", text: "Не удалось отправить. Попробуйте позже." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-custom-xl flex items-center justify-center hover:scale-110 transition-all"
        aria-label="Чат с ассистентом"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed left-4 bottom-20 z-50 w-80 md:w-96 bg-card rounded-2xl shadow-custom-xl border border-border overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold">AI Ассистент</h3>
                <p className="text-sm text-primary-foreground/80">
                  {isWebhookConfigured ? "Онлайн" : "Webhook не настроен"}
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 p-4 overflow-y-auto bg-background">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={14} className="text-primary" />
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary/10 text-foreground rounded-tr-sm ml-auto"
                        : "bg-secondary text-foreground rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              ))}
              {error && (
                <p className="text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button size="icon" disabled={!message.trim() || isSending} onClick={sendMessage}>
                <Send size={18} className={isSending ? "animate-spin" : ""} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {isWebhookConfigured
                ? "Сообщение уйдет в ваш n8n webhook"
                : "Добавьте VITE_N8N_WEBHOOK_URL в .env"}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
