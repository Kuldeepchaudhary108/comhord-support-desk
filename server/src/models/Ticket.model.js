import mongoose, { Schema } from "mongoose";

const ReplySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["public", "internal"],
      default: "public",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ActivitySchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "created",
        "assigned",
        "status_changed",
        "priority_changed",
        "reply_added",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const TicketSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    status: {
      type: String,
      enum: [
        "open",
        "in-progress",
        "waiting-on-customer",
        "resolved",
      ],
      default: "open",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    replies: [ReplySchema],

    activityHistory: [ActivitySchema],
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", TicketSchema);
export default Ticket;
