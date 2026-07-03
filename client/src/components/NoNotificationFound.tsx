import { BellIcon } from "lucide-react";

const NoNotificationFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center px-4">
      <div className="size-16 sm:size-20 rounded-full bg-base-300 flex items-center justify-center mb-4 sm:mb-6">
        <BellIcon className="size-8 sm:size-10 text-base-content opacity-40" />
      </div>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
        No notifications yet!
      </h3>
      <p className="text-sm sm:text-base text-base-content opacity-70 max-w-md">
        When you receive friend requests or messages, they'll appear here.
      </p>
    </div>
  );
};
export default NoNotificationFound;
