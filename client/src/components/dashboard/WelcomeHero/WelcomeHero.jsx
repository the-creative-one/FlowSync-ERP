import React from "react";
import {
  CalendarDays,
  Clock,
} from "lucide-react";

import { getHeroModules } from "./HeroModules";
import { getHeroDescription } from "./HeroDescription";
import HeroPreview from "./HeroPreview";
import HeroMobileModules from "./HeroMobileModules";

function WelcomeHero({ user }) {
  const firstName =
    user?.name?.split(" ")[0] || "User";

  const permissions = user?.permissions || {};

  const modules = getHeroModules(permissions);

  const description =
    getHeroDescription(permissions);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const date = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-[#0f2d40]
        via-[#164766]
        to-[#1b5b80]
        p-8
        lg:p-10
        shadow-xl
      "
    >
      {/* Background Glow */}

      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="relative z-10 grid xl:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
        {/* LEFT */}

        <div>
          <p className="text-cyan-200 font-medium text-lg">
            {greeting} 👋
          </p>

          <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white leading-tight">
            Welcome! {firstName}
          </h1>

          <p className="mt-5 max-w-2xl text-cyan-100/90 leading-8 text-lg">
            {description}
          </p>

          <div className="flex flex-wrap gap-6 mt-8 text-cyan-100 text-sm">

            <div className="flex items-center gap-2">

              <CalendarDays size={18} />

              <span>{date}</span>

            </div>

            <div className="flex items-center gap-2">

              <Clock size={18} />

              <span>
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

            </div>

          </div>

          <HeroMobileModules
            modules={modules}
          />
        </div>

        {/* RIGHT */}

        <HeroPreview modules={modules} />
      </div>
    </section>
  );
}

export default WelcomeHero;