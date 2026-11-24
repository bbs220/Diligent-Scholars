import mongoose, { InferSchemaType, HydratedDocument } from "mongoose";

// study session schema definition
const sessionSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    callId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  },
);

export type typeSession = InferSchemaType<typeof sessionSchema>;
export type typeSessionDocument = HydratedDocument<typeSession>;

// study session model export
const Session =
  mongoose.models.Session ||
  mongoose.model<typeSession>("Session", sessionSchema);

export default Session;
