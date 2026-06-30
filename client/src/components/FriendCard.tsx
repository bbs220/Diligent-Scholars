import { Link } from "react-router";
import type { typeUser } from "../types/typesCollection";

interface FriendCard {
  friend: typeUser;
}

const FriendCard = ({ friend }: FriendCard) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* user info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar p-12">
            <img src={friend.profileAvatar} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>
        {/* badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-primary text-xs">
            📘 {friend.skillToShare}
          </span>
          <span className="badge badge-secondary text-xs">
            📖 {friend.skillToLearn}
          </span>
        </div>
        {/* link to chat */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;
