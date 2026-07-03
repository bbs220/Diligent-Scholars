import { Link } from "react-router";
import type { typeUser } from "../types/typesCollection";
import { capitalize } from "../libs/helper";

interface FriendCard {
  friend: typeUser;
}

const FriendCard = ({ friend }: FriendCard) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="card-body p-4 sm:p-5 flex flex-col h-full">
        {/* user info */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 min-w-0">
          <div className="avatar shrink-0">
            <div className="size-12 sm:size-14 rounded-xl">
              <img
                src={friend.profileAvatar}
                alt={friend.fullName}
                className="object-cover"
              />
            </div>
          </div>
          <h3 className="font-semibold text-base sm:text-lg truncate flex-1 min-w-0">
            {friend.fullName}
          </h3>
        </div>
        {/* badges */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
          <span className="badge badge-success badge-sm sm:badge-md">
            📘 {capitalize(friend.skillToShare)}
          </span>
          <span className="badge badge-warning badge-sm sm:badge-md">
            📖 {capitalize(friend.skillToLearn)}
          </span>
        </div>
        {/* link to chat */}
        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-outline w-full mt-auto btn-sm sm:btn-md"
        >
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;
