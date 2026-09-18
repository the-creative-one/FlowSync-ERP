import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import api from "../../api/axios";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../../context/AuthContext";

function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNudge, setShowNudge] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the FlowSync ERP Assistant. How can I help you?",
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowNudge(true);
      }, 10000);

      return () => clearTimeout(timer);
    }

    setShowNudge(false);
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/chatbot",
        {
          message: userMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't process your request right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = (question) => {
    setMessage(question);
  };

  return (
    <>
      {showNudge && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs">
          <div className="relative bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl px-4 py-3">
            <button
              onClick={() => setShowNudge(false)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 flex items-center justify-center shadow-sm"
            >
              <X size={13} />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center">
                <Bot size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#0C2B4E] dark:text-white">
                  Need help?
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ask the FlowSync Assistant anything about the app.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white dark:bg-[#111827] border-r border-b border-gray-200 dark:border-gray-700 rotate-45" />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open FlowSync Assistant"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#2563EB] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-md h-[600px] bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 bg-[#0C2B4E] text-white">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
                <Bot size={21} />

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0C2B4E] rounded-full" />
              </div>

              <div className="flex-1">
                <h2 className="font-semibold">FlowSync Assistant</h2>

                <p className="text-xs text-white/70 mt-0.5">
                  Online • Here to help
                </p>
              </div>

              <Sparkles size={18} className="text-white/70" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {messages.length === 1 && (
              <div className="space-y-2 mb-5">
                <p className="text-xs text-gray-400 dark:text-gray-500 px-1">
                  Try asking
                </p>

                <div className="flex flex-wrap gap-2">
                  {[
                    "What can I do in FlowSync?",
                    "What can an employee access?",
                    "How do I manage orders?",
                  ].map((question) => (
                    <button
                      key={question}
                      onClick={() => askQuestion(question)}
                      className="text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((item, index) => {
              const isUser = item.role === "user";

              return (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 shrink-0 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#2563EB] text-white rounded-2xl rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{item.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
                        <ReactMarkdown>{item.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 shrink-0">
                      <UserAvatar
                        user={user}
                        size="sm"
                        iconClassName="dark:text-white text-[#0C2B4E]"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl px-2 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 min-w-0 px-3 py-2 bg-transparent text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="w-10 h-10 shrink-0 rounded-xl bg-[#2563EB] text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Send size={17} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Chatbot;
