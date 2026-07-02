import { VideoIcon } from "lucide-react";

interface CallButtonProps {
  handleVideoCall: () => void;
}

const CallButton = ({ handleVideoCall }: CallButtonProps) => {
  return (
    <div className="absolute top-4 left-4 z-50 flex items-center">
      <button
        onClick={handleVideoCall}
        className="btn btn-success text-white rounded-md px-3"
      >
        <VideoIcon className="size-4" />
        Video Call
      </button>
    </div>
  );
};

export default CallButton;
