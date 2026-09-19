import { motion } from "framer-motion";
import { Activity, BarChart3, Package, Sparkles, Users } from "lucide-react";
import { Link } from "react-router-dom";

const chartBars = [35, 52, 44, 68, 56, 78, 70];

function Hero() {
  return (
    <section className="min-h-screen flex items-center bg-[#F8FAFC] dark:bg-[#020817] pt-24 pb-6 transition-colors">
      <div className="w-full max-w-7xl mx-auto px-5 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-blue-100
                dark:bg-blue-500/10
                text-[#0C2B4E]
                dark:text-blue-300
                mb-5
              "
            >
              <Sparkles size={16} />
              <span>Modern ERP Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0C2B4E] dark:text-white leading-[1.08] tracking-tight">
              Streamline Your Business Operations With One Powerful ERP Platform
            </h1>

            <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              Manage orders, track performance, collaborate with teams and gain
              real-time insights through a centralized business management
              system.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-sm bg-[#0C2B4E] text-white hover:scale-[1.02] transition-transform duration-300"
              >
                Get Started
              </Link>

              <Link
                to="/features"
                className="
                  px-6 py-3 rounded-sm
                  border border-gray-600
                  text-[#0C2B4E]
                  hover:bg-gray-100
                  hover:scale-[1.02]
                  transition-all duration-300
                  dark:border-gray-600
                  dark:text-white
                  dark:hover:bg-[#111827]
                "
              >
                Explore Features
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}

          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            <div className="relative w-full max-w-xl mx-auto">
              <div className="rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden">
                {/* Top bar */}

                <div className="h-11 px-4 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center">
                    <img
                      src="/White-Logo.png"
                      alt="FlowSync"
                      className="h-6 w-auto object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{
                        opacity: [0.45, 1, 0.45],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 4,
                        ease: "easeInOut",
                      }}
                      className="w-1.5 h-1.5 rounded-full bg-green-400"
                    />

                    <span className="text-[9px] text-white/50">Live</span>
                  </div>
                </div>

                {/* Dashboard */}

                <div className="p-4 sm:p-5 bg-[#111C30]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[9px] text-white/40">Overview</p>
                    </div>

                    <Activity size={15} className="text-blue-400" />
                  </div>

                  {/* Stats */}

                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] text-white/40">Orders</p>

                        <Package size={13} className="text-blue-400" />
                      </div>

                      <motion.p
                        animate={{
                          opacity: [1, 0.72, 1],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          repeatDelay: 5,
                          ease: "easeInOut",
                        }}
                        className="text-base font-semibold text-white mt-1"
                      >
                        248
                      </motion.p>

                      <p className="text-[8px] text-green-400 mt-1">+12.5%</p>
                    </div>

                    <div className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3">
                      <p className="text-[8px] text-white/40">Revenue</p>

                      <motion.p
                        animate={{
                          opacity: [1, 0.72, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 6,
                          ease: "easeInOut",
                        }}
                        className="text-base font-semibold text-white mt-1"
                      >
                        ₹1.24M
                      </motion.p>

                      <p className="text-[8px] text-green-400 mt-1">+8.4%</p>
                    </div>

                    <div className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] text-white/40">Team</p>

                        <Users size={13} className="text-blue-400" />
                      </div>

                      <motion.p
                        animate={{
                          opacity: [1, 0.72, 1],
                        }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          repeatDelay: 7,
                          ease: "easeInOut",
                        }}
                        className="text-base font-semibold text-white mt-1"
                      >
                        42
                      </motion.p>

                      <p className="text-[8px] text-green-400 mt-1">Active</p>
                    </div>
                  </div>

                  {/* Chart + Activity */}

                  <div className="grid sm:grid-cols-[1.3fr_0.7fr] gap-3 mt-3">
                    {/* Chart */}

                    <div className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-medium text-white/80">
                            Order Performance
                          </p>

                          <p className="text-[7px] text-white/35 mt-0.5">
                            Last 7 months
                          </p>
                        </div>

                        <BarChart3 size={13} className="text-blue-400" />
                      </div>

                      <div className="h-20 mt-3 flex items-end gap-2">
                        {chartBars.map((height, index) => (
                          <motion.div
                            key={index}
                            initial={{ height: `${height}%` }}
                            animate={{
                              height: [
                                `${height}%`,
                                `${Math.min(height + 5, 90)}%`,
                                `${height}%`,
                              ],
                            }}
                            transition={{
                              duration: 4 + index * 0.35,
                              repeat: Infinity,
                              repeatDelay: 5 + index * 0.4,
                              ease: "easeInOut",
                            }}
                            className="flex-1 rounded-t-md bg-blue-500/70"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Activity */}

                    <div className="rounded-xl bg-white/[0.05] border border-white/[0.07] p-3">
                      <p className="text-[9px] font-medium text-white/80">
                        Recent Activity
                      </p>

                      <div className="mt-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={{
                              opacity: [0.35, 1, 0.35],
                            }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              repeatDelay: 5,
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"
                          />

                          <div className="min-w-0">
                            <p className="text-[8px] text-white/60 truncate">
                              New order created
                            </p>

                            <p className="text-[7px] text-white/30">
                              2 min ago
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={{
                              opacity: [0.35, 1, 0.35],
                            }}
                            transition={{
                              duration: 2.4,
                              repeat: Infinity,
                              repeatDelay: 6,
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"
                          />

                          <div className="min-w-0">
                            <p className="text-[8px] text-white/60 truncate">
                              Order delivered
                            </p>

                            <p className="text-[7px] text-white/30">
                              5 min ago
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.span
                            animate={{
                              opacity: [0.35, 1, 0.35],
                            }}
                            transition={{
                              duration: 2.6,
                              repeat: Infinity,
                              repeatDelay: 7,
                            }}
                            className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"
                          />

                          <div className="min-w-0">
                            <p className="text-[8px] text-white/60 truncate">
                              Report exported
                            </p>

                            <p className="text-[7px] text-white/30">
                              8 min ago
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Summary */}

                  <motion.div
                    animate={{
                      borderColor: [
                        "rgba(255,255,255,0.07)",
                        "rgba(37,99,235,0.25)",
                        "rgba(255,255,255,0.07)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 8,
                      ease: "easeInOut",
                    }}
                    className="mt-3 rounded-xl bg-white/[0.05] border border-white/[0.07] px-3 py-2.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Package size={12} className="text-blue-400" />
                      </div>

                      <div>
                        <p className="text-[8px] text-white/70">
                          Pending Orders
                        </p>

                        <p className="text-[7px] text-white/35 mt-0.5">
                          Requires attention
                        </p>
                      </div>
                    </div>

                    <motion.p
                      animate={{
                        scale: [1, 1.04, 1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        repeatDelay: 7,
                        ease: "easeInOut",
                      }}
                      className="text-sm font-semibold text-white"
                    >
                      18
                    </motion.p>
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

export default Hero;
