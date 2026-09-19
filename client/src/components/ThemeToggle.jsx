import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        w-11 h-11
        rounded-full
        border
        border-gray-500
      dark:border-gray-700
      bg-[#0F172A]
      dark:bg-white
      text-white
      dark:text-[#183657]
        flex
        items-center
        justify-center
        transition
        hover:scale-105
      "
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;
