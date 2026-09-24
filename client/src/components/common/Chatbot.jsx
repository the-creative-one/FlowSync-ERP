import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  Check,
  MessageCircle,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";
import api from "../../api/axios";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../../context/AuthContext";

const welcomeMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi! I'm the FlowSync Assistant. How can I help you?",
  timestamp: new Date(),
};

function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkNudge = () => {
      const lastNudge = localStorage.getItem("flowsync_chatbot_nudge");
      if (!lastNudge || Date.now() - Number(lastNudge) > 10 * 60 * 1000) {
        setShowNudge(true);
        localStorage.setItem("flowsync_chatbot_nudge", Date.now().toString());
      }
    };
    const initialTimer = setTimeout(checkNudge, 2500);
    const interval = setInterval(checkNudge, 60 * 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowNudge(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!isOpen) return;

    if (!user) {
      setMessages([
        {
          ...welcomeMessage,
          timestamp: new Date(),
        },
      ]);
      setHistoryLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setHistoryLoading(true);

        const response = await api.get("/chatbot/history");

        const history = response.data.map((item) => ({
          id: item._id,
          role: item.role,
          content: item.content,
          timestamp: item.createdAt,
        }));

        setMessages(
          history.length > 0
            ? history
            : [
                {
                  ...welcomeMessage,
                  timestamp: new Date(),
                },
              ],
        );
      } catch (error) {
        console.error(error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, [isOpen, user]);

  const getBotResponse = async (userMessage) => {
    const response = await api.post("/chatbot", {
      message: userMessage,
    });

    return response.data.reply;
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const reply = await getBotResponse(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "error",
          content:
            "I couldn't connect to the FlowSync Assistant. Please try again.",
          timestamp: new Date(),
          failedMessage: userMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const retryMessage = async (userMessage, errorId) => {
    if (loading) return;

    setMessages((prev) => prev.filter((item) => item.id !== errorId));

    setLoading(true);

    try {
      const reply = await getBotResponse(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "error",
          content: "I still couldn't connect. Please try again in a moment.",
          timestamp: new Date(),
          failedMessage: userMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = async () => {
    if (loading) return;

    if (!user) {
      setMessages([
        {
          ...welcomeMessage,
          id: `welcome-${Date.now()}`,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    try {
      await api.delete("/chatbot/history");

      setMessages([
        {
          ...welcomeMessage,
          id: `welcome-${Date.now()}`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const askQuestion = (question) => {
    setMessage(question);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {showNudge && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[calc(100%-3rem)] max-w-xs">
          <div className="relative bg-white dark:bg-[#111827] rounded-2xl shadow-xl px-4 py-3">
            <button
              onClick={() => setShowNudge(false)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 flex items-center justify-center shadow-sm"
            >
              <X size={13} />
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 shrink-0 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center">
                  <Bot size={19} />

                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0C2B4E] rounded-full" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#0C2B4E] dark:text-white">
                    Need help?
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Ask the FlowSync Assistant.
                  </p>
                </div>
              </div>
            </button>

            <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white dark:bg-[#111827] rotate-45" />
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open FlowSync Assistant"
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-[#2563EB] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      {isOpen && (
        <div className="fixed z-50 left-3 right-3 bottom-20 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-[calc(100%-3rem)] max-w-md sm:h-[600px] lg:h-[560px] bg-white dark:bg-[#0F172A] rounded-4xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 sm:px-5 py-4 bg-[#0C2B4E] text-white">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 rounded-full bg-white/15 flex items-center justify-center">
                <Bot size={21} />

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#0C2B4E] rounded-full" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">FlowSync Assistant</h2>

                <p className="text-xs text-white/70 mt-0.5">
                  Online • Here to help
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearConversation}
                  disabled={loading || historyLoading}
                  title="Clear conversation"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white/70  hover:text-white transition-colors disabled:opacity-40"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-5 space-y-4">
            {historyLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[#2563EB] rounded-full animate-spin" />
                  Loading conversation...
                </div>
              </div>
            ) : (
              <>
                {messages.length === 1 && messages[0].role === "assistant" && (
                  <div className="space-y-3 mb-5">
                    <div className="grid sm:grid-cols-2 gap-2">
                      {[
                        "What can I do in FlowSync?",
                        "What can an employee access?",
                        "How do I create an order?",
                        "How to get monthly orders data?",
                      ].map((question) => (
                        <button
                          key={question}
                          onClick={() => askQuestion(question)}
                          className="text-left text-xs px-3 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((item) => {
                  const isUser = item.role === "user";
                  const isError = item.role === "error";

                  if (isError) {
                    return (
                      <div key={item.id} className="flex items-end gap-2">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-[#0C2B4E] text-white flex items-center justify-center">
                          <Bot size={16} />
                        </div>

                        <div className="max-w-[82%] bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl rounded-bl-md px-4 py-3">
                          <p className="text-sm text-red-600 dark:text-red-300 leading-relaxed">
                            {item.content}
                          </p>

                          <button
                            onClick={() =>
                              retryMessage(item.failedMessage, item.id)
                            }
                            disabled={loading}
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-300 hover:underline disabled:opacity-50"
                          >
                            <RotateCcw size={13} />
                            Try again
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.id}
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
                        className={`max-w-[82%] ${
                          isUser
                            ? "flex flex-col items-end"
                            : "flex flex-col items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 text-sm leading-relaxed ${
                            isUser
                              ? "bg-[#2563EB] text-white rounded-2xl rounded-br-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md"
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">
                              {item.content}
                            </p>
                          ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2">
                              <ReactMarkdown>{item.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-1 px-1 text-gray-400 dark:text-gray-500">
                          <span className="text-[10px]">
                            {formatTime(item.timestamp)}
                          </span>

                          {isUser && <Check size={11} />}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-8 h-8 shrink-0">
                          <UserAvatar
                            user={user}
                            size="sm"
                            iconClassName="text-[#0C2B4E] dark:text-white"
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

                    <div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 mt-1 px-1">
                        FlowSync Assistant is typing...
                      </p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-full px-2 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about FlowSync..."
                disabled={loading || historyLoading}
                className="flex-1 min-w-0 px-3 py-2 bg-transparent text-sm text-gray-800 dark:text-white outline-none placeholder:text-gray-400 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={loading || historyLoading || !message.trim()}
                className="w-10 h-10 shrink-0 rounded-full bg-[#2563EB] text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
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
