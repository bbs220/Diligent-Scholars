import mongoose from "mongoose";

const friendReqSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reqStatus: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const FriendReq =
  mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", friendReqSchema);

export default FriendReq;
