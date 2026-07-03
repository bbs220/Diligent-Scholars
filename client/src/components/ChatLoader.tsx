import { LoaderIcon } from "lucide-react";

const ChatLoader = () => {
  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4 bg-base-100">
      <LoaderIcon className="animate-spin size-10 sm:size-12 md:size-14 text-primary" />
      <p className="mt-3 sm:mt-4 text-center text-base sm:text-lg md:text-xl font-mono opacity-80">
        Connecting to chat...
      </p>
    </div>
  );
};
export default ChatLoader;
