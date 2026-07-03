import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className="min-h-dvh flex items-center justify-center bg-base-100"
      data-theme={theme}
    >
      <LoaderIcon className="animate-spin size-10 sm:size-12 md:size-16 text-primary" />
    </div>
  );
};

export default PageLoader;
