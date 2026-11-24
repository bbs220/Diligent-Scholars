import { VideoIcon } from "lucide-react";

type typeCallButtonProps = {
  handleVideoCall: () => void;
};

// call button component with responsive icon and label
const CallButton = ({ handleVideoCall }: typeCallButtonProps) => {
  return (
    <button
      onClick={handleVideoCall}
      className="btn btn-success btn-sm text-white rounded-md px-2.5 sm:px-3 gap-1 min-h-9"
      title="Start Video Call"
    >
      <VideoIcon className="size-4 shrink-0" />
      <span className="hidden sm:inline">Video Call</span>
    </button>
  );
};

export default CallButton;
