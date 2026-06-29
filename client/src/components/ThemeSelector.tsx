import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const ThemeSelector = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-accent btn-square"
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5" />
      )}
    </button>
  );
};

export default ThemeSelector;
