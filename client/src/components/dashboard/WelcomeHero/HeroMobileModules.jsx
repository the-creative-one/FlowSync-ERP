import React from "react";

function HeroMobileModules({ modules }) {
  if (!modules?.length) return null;

  return (
    <div className="mt-8 xl:hidden">

      <div className="flex flex-wrap gap-3">

        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.id}
              className="
                flex items-center gap-2
                rounded-xl
                border border-white/10
                bg-white/10
                backdrop-blur-md
                px-4
                py-3
                transition-all
                duration-300
                hover:bg-white/15
                hover:-translate-y-1
              "
            >
              <Icon
                size={18}
                className="text-cyan-300"
              />

              <span className="text-sm font-medium text-white">
                {module.title}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default HeroMobileModules;