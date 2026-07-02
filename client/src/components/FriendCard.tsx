import { Link } from "react-router";
import type { typeUser } from "../types/typesCollection";
import { capitalize } from "../libs/helper";

interface FriendCard {
  friend: typeUser;
}

const FriendCard = ({ friend }: FriendCard) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* user info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar">
            <div className="w-12 rounded-md">
              <img src={friend.profileAvatar} alt={friend.fullName} />
            </div>
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>
        {/* badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-primary text-xs">
            📘 {capitalize(friend.skillToShare)}
          </span>
          <span className="badge badge-secondary text-xs">
            📖 {capitalize(friend.skillToLearn)}
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
