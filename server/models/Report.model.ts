import mongoose, { InferSchemaType, HydratedDocument } from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export type typeReport = InferSchemaType<typeof reportSchema>;
export type typeReportDocument = HydratedDocument<typeReport>;

const Report =
  mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
