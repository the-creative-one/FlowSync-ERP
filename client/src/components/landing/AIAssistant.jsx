import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  MessageCircle,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import UserAvatar from "../common/UserAvatar";

const conversations = [
  {
    user: "What can I do with FlowSync?",
    assistant:
      "FlowSync brings your everyday operations into one place. You can manage orders, track performance, manage employees and permissions, explore analytics, export reports and keep an eye on platform activity.",
  },
  {
    user: "How do permissions work?",
    assistant:
      "Access is role-based and can be customized with specific permissions. That means each user can have access to the parts of FlowSync they actually need, while sensitive actions stay restricted.",
  },
  {
    user: "Can you help me understand my analytics?",
    assistant:
      "Absolutely. You can use FlowSync Analytics to track orders, revenue and performance across different time periods, helping you understand what's happening across your business.",
  },
  {
    user: "What can you help me with?",
    assistant:
      "I can help you understand FlowSync, find features, explain workflows and answer questions about what you can access. If you're signed in, I can also tailor my answers to your role and permissions.",
  },
];

function AIAssistant() {
  const capabilities = [
    {
      icon: BrainCircuit,
      title: "Context-aware",
      description:
        "Understands FlowSync features, workflows and how different parts of the platform work together.",
    },
    {
      icon: ShieldCheck,
      title: "Role-aware",
      description:
        "Provides answers based on the capabilities available to the signed-in user.",
    },
    {
      icon: MessageCircle,
      title: "Always within reach",
      description:
        "Get help with FlowSync without leaving the page you're working on.",
    },
  ];

  const [conversationIndex, setConversationIndex] = useState(0);
  const [userText, setUserText] = useState("");
  const [assistantText, setAssistantText] = useState("");
  const [phase, setPhase] = useState("waiting");

  const currentConversation = conversations[conversationIndex];

  useEffect(() => {
    let timeout;

    if (phase === "waiting") {
      timeout = setTimeout(() => {
        setUserText("");
        setAssistantText("");
        setPhase("userTyping");
      }, 1400);
    }

    if (phase === "userTyping") {
      if (userText.length < currentConversation.user.length) {
        timeout = setTimeout(() => {
          setUserText(currentConversation.user.slice(0, userText.length + 1));
        }, 45);
      } else {
        timeout = setTimeout(() => {
          setPhase("thinking");
        }, 500);
      }
    }

    if (phase === "thinking") {
      timeout = setTimeout(() => {
        setAssistantText("");
        setPhase("assistantTyping");
      }, 1200);
    }

    if (phase === "assistantTyping") {
      if (assistantText.length < currentConversation.assistant.length) {
        timeout = setTimeout(() => {
          setAssistantText(
            currentConversation.assistant.slice(0, assistantText.length + 1),
          );
        }, 22);
      } else {
        timeout = setTimeout(() => {
          setPhase("next");
        }, 2200);
      }
    }

    if (phase === "next") {
      setConversationIndex((previous) => (previous + 1) % conversations.length);

      setUserText("");
      setAssistantText("");
      setPhase("userTyping");
    }

    return () => clearTimeout(timeout);
  }, [phase, userText, assistantText, currentConversation]);

  return (
    <section
      className="
      py-16
        md:py-24
        bg-white
        dark:bg-[#020817]
        transition-colors
      "
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className="
            grid
            lg:grid-cols-2
            gap-12
            lg:gap-20
            items-center
          "
        >
          {/* Content */}

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="
                mt-2
                text-4xl
                md:text-5xl
                font-bold
                leading-tight
                text-[#0C2B4E]
                dark:text-white
              "
            >
              Meet Your FlowSync Assistant
            </h2>

            <p
              className="
                mt-5
                text-lg
                leading-relaxed
                text-gray-600
                dark:text-gray-400
                max-w-xl
              "
            >
              Need to understand a workflow, find a feature or check what you
              can access? Just ask. The FlowSync Assistant is built into the
              platform to help users get answers when they need them.
            </p>

            <div className="mt-8 space-y-5">
              {capabilities.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + index * 0.1,
                    }}
                    className="flex gap-4"
                  >
                    <div
                      className="
                        shrink-0
                        w-11
                        h-11
                        rounded-xl
                        bg-blue-50
                        dark:bg-blue-500/10
                        border
                        border-blue-100
                        dark:border-blue-500/20
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Icon
                        size={21}
                        className="text-[#2563EB] dark:text-blue-400"
                      />
                    </div>

                    <div>
                      <h3
                        className="
                          text-lg
                          font-semibold
                          text-[#0C2B4E]
                          dark:text-white
                        "
                      >
                        {item.title}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-relaxed
                          text-gray-600
                          dark:text-gray-400
                          max-w-lg
                        "
                      >
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Desktop Assistant Preview */}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="
              hidden
              lg:block
              relative
              w-full
              max-w-xl
              mx-auto
            "
          >
            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                dark:border-gray-800
                bg-gray-50
                dark:bg-[#111827]
                shadow-xl
                shadow-black/5
                dark:shadow-black/20
              "
            >
              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  border-b
                  border-gray-200
                  dark:border-gray-800
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#0C2B4E]
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <Bot size={21} />
                  </div>

                  <div>
                    <p
                      className="
                        font-semibold
                        text-[#0C2B4E]
                        dark:text-white
                      "
                    >
                      FlowSync Assistant
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-emerald-500
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Ready to help
                      </span>
                    </div>
                  </div>
                </div>

                <X size={19} className="text-blue-500 dark:text-blue-400" />
              </div>

              {/* Messages */}

              <div className="p-5 space-y-5 min-h-[350px]">
                {/* User message */}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: userText ? 1 : 0,
                    y: userText ? 0 : 8,
                  }}
                  className="flex items-end justify-end gap-2"
                >
                  <div
                    className="
                      max-w-[80%]
                      px-4
                      py-3
                      rounded-2xl
                      rounded-br-md
                      bg-[#0C2B4E]
                      text-white
                      text-sm
                      leading-relaxed
                      min-h-[44px]
                    "
                  >
                    {userText}

                    {phase === "userTyping" &&
                      userText.length < currentConversation.user.length && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                          }}
                          className="inline-block ml-0.5"
                        >
                          |
                        </motion.span>
                      )}
                  </div>

                  <UserAvatar
                    user={null}
                    size="sm"
                    iconClassName="text-[#0C2B4E] dark:text-white"
                    className="
                      w-8
                      h-8
                      shrink-0
                      bg-white
                      dark:bg-gray-800
                      border-gray-200
                      dark:border-gray-700
                    "
                  />
                </motion.div>

                {/* Thinking */}

                {phase === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div
                      className="
                        w-8
                        h-8
                        shrink-0
                        rounded-full
                        bg-[#0C2B4E]
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Bot size={16} />
                    </div>

                    <div>
                      <div
                        className="
                          bg-white
                          dark:bg-[#1A2436]
                          border
                          border-gray-200
                          dark:border-gray-700
                          rounded-2xl
                          rounded-bl-md
                          px-4
                          py-3
                        "
                      >
                        <div className="flex gap-1">
                          {[0, 1, 2].map((item) => (
                            <motion.span
                              key={item}
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: item * 0.15,
                              }}
                              className="
                                w-2
                                h-2
                                rounded-full
                                bg-gray-400
                              "
                            />
                          ))}
                        </div>
                      </div>

                      <p
                        className="
                          text-[10px]
                          text-gray-400
                          mt-1
                          px-1
                        "
                      >
                        FlowSync Assistant is typing...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Assistant response */}

                {(phase === "assistantTyping" || phase === "next") &&
                  assistantText && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div
                        className="
                          w-8
                          h-8
                          shrink-0
                          rounded-full
                          bg-[#0C2B4E]
                          text-white
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Bot size={16} />
                      </div>

                      <div
                        className="
                          max-w-[85%]
                          px-4
                          py-3
                          rounded-2xl
                          rounded-tl-md
                          bg-white
                          dark:bg-[#1A2436]
                          border
                          border-gray-200
                          dark:border-gray-700
                          text-sm
                          leading-relaxed
                          text-gray-700
                          dark:text-gray-300
                        "
                      >
                        {assistantText}

                        {phase === "assistantTyping" &&
                          assistantText.length <
                            currentConversation.assistant.length && (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{
                                duration: 0.7,
                                repeat: Infinity,
                              }}
                              className="inline-block ml-0.5"
                            >
                              |
                            </motion.span>
                          )}
                      </div>
                    </motion.div>
                  )}
              </div>

              {/* Input */}

              <div className="px-5 pb-5">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-white
                    dark:bg-[#0F172A]
                  "
                >
                  <span
                    className="
                      flex-1
                      text-sm
                      text-gray-400
                    "
                  >
                    Ask the FlowSync Assistant...
                  </span>

                  <motion.div
                    animate={{
                      scale: [1, 1.04, 1],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-[#2563EB]
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <Send size={16} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Assistant Preview */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="
              lg:hidden
              relative
              w-full
              max-w-md
              mx-auto
            "
          >
            <div
              className="
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                dark:border-gray-800
                bg-gray-50
                dark:bg-[#111827]
                shadow-xl
                shadow-black/5
                dark:shadow-black/20
              "
            >
              {/* Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  border-b
                  border-gray-200
                  dark:border-gray-800
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#0C2B4E]
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <Bot size={21} />
                  </div>

                  <div>
                    <p
                      className="
                        font-semibold
                        text-[#0C2B4E]
                        dark:text-white
                      "
                    >
                      FlowSync Assistant
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="
                          w-1.5
                          h-1.5
                          rounded-full
                          bg-emerald-500
                        "
                      />

                      <span
                        className="
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Ready to help
                      </span>
                    </div>
                  </div>
                </div>

                <X size={19} className="text-blue-500 dark:text-blue-400" />
              </div>

              {/* Messages */}

              <div className="p-5 space-y-5 min-h-[350px]">
                {/* User message */}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: userText ? 1 : 0,
                    y: userText ? 0 : 8,
                  }}
                  className="flex items-end justify-end gap-2"
                >
                  <div
                    className="
                      max-w-[80%]
                      px-4
                      py-3
                      rounded-2xl
                      rounded-br-md
                      bg-[#0C2B4E]
                      text-white
                      text-sm
                      leading-relaxed
                      min-h-[44px]
                    "
                  >
                    {userText}

                    {phase === "userTyping" &&
                      userText.length < currentConversation.user.length && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                          }}
                          className="inline-block ml-0.5"
                        >
                          |
                        </motion.span>
                      )}
                  </div>

                  <UserAvatar
                    user={null}
                    size="sm"
                    iconClassName="text-[#0C2B4E] dark:text-white"
                    className="
                      w-8
                      h-8
                      shrink-0
                      bg-white
                      dark:bg-gray-800
                      border-gray-200
                      dark:border-gray-700
                    "
                  />
                </motion.div>

                {/* Thinking */}

                {phase === "thinking" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div
                      className="
                        w-8
                        h-8
                        shrink-0
                        rounded-full
                        bg-[#0C2B4E]
                        text-white
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Bot size={16} />
                    </div>

                    <div>
                      <div
                        className="
                          bg-white
                          dark:bg-[#1A2436]
                          border
                          border-gray-200
                          dark:border-gray-700
                          rounded-2xl
                          rounded-bl-md
                          px-4
                          py-3
                        "
                      >
                        <div className="flex gap-1">
                          {[0, 1, 2].map((item) => (
                            <motion.span
                              key={item}
                              animate={{ y: [0, -3, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: item * 0.15,
                              }}
                              className="
                                w-2
                                h-2
                                rounded-full
                                bg-gray-400
                              "
                            />
                          ))}
                        </div>
                      </div>

                      <p
                        className="
                          text-[10px]
                          text-gray-400
                          mt-1
                          px-1
                        "
                      >
                        FlowSync Assistant is typing...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Assistant response */}

                {(phase === "assistantTyping" || phase === "next") &&
                  assistantText && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div
                        className="
                          w-8
                          h-8
                          shrink-0
                          rounded-full
                          bg-[#0C2B4E]
                          text-white
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Bot size={16} />
                      </div>

                      <div
                        className="
                          max-w-[85%]
                          px-4
                          py-3
                          rounded-2xl
                          rounded-tl-md
                          bg-white
                          dark:bg-[#1A2436]
                          border
                          border-gray-200
                          dark:border-gray-700
                          text-sm
                          leading-relaxed
                          text-gray-700
                          dark:text-gray-300
                        "
                      >
                        {assistantText}

                        {phase === "assistantTyping" &&
                          assistantText.length <
                            currentConversation.assistant.length && (
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{
                                duration: 0.7,
                                repeat: Infinity,
                              }}
                              className="inline-block ml-0.5"
                            >
                              |
                            </motion.span>
                          )}
                      </div>
                    </motion.div>
                  )}
              </div>

              {/* Input */}

              <div className="px-5 pb-5">
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-white
                    dark:bg-[#0F172A]
                  "
                >
                  <span
                    className="
                      flex-1
                      text-sm
                      text-gray-400
                    "
                  >
                    Ask the FlowSync Assistant...
                  </span>

                  <motion.div
                    animate={{
                      scale: [1, 1.04, 1],
                      opacity: [0.85, 1, 0.85],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-[#2563EB]
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <Send size={16} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;
