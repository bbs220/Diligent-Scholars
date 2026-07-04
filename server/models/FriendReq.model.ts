import mongoose, { InferSchemaType, HydratedDocument } from "mongoose";

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

export type FriendReqType = InferSchemaType<typeof friendReqSchema>;
export type FriendReqDocument = HydratedDocument<FriendReqType>;

const FriendReq =
  mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", friendReqSchema);

export default FriendReq;
