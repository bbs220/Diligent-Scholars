import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const ThemeSelector = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-accent btn-square btn-sm sm:btn-md"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="size-4 sm:size-5" />
      ) : (
        <Sun className="size-4 sm:size-5" />
      )}
    </button>
  );
};

export default ThemeSelector;
