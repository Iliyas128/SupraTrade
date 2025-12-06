import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

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
                <p className="text-sm text-primary-foreground/80">Онлайн</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 p-4 overflow-y-auto bg-background">
            <div className="space-y-4">
              {/* Bot Message */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm">
                    Здравствуйте! 👋 Я AI-ассистент SUPRA TRADE. Чем могу помочь?
                  </p>
                </div>
              </div>

              {/* Info Messages */}
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={14} className="text-primary" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm">
                    Я могу помочь вам с:
                  </p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Подбором продукции</li>
                    <li>• Информацией о ценах</li>
                    <li>• Условиями доставки</li>
                    <li>• Оформлением заказа</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <Button size="icon" disabled={!message.trim()}>
                <Send size={18} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Подключите AI-ассистента для полного функционала
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
