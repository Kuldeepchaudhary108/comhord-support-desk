import { Ticket } from "../models/Ticket.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOverdueStatus } from "../utils/ticket.utils.js";

export const createTicket = asyncHandler(async (req, res) => {
  const {
    subject,
    customerName,
    customerEmail,
    description,
    priority,
  } = req.body;

  if (
    !subject ||
    !customerName ||
    !customerEmail ||
    !description
  ) {
    throw new ApiError(
      400,
      "Subject, customer name, customer email and description are required"
    );
  }

  const ticket = await Ticket.create({
    subject,
    customerName,
    customerEmail,
    description,
    priority: priority || "medium",

    activityHistory: [
      {
        type: "created",
        message: "Ticket created",
        performedBy: req.user._id,
      },
    ],
  });

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate("assignedTo", "name email role")
    .populate("activityHistory.performedBy", "name email role")
    .populate("replies.author", "name email role");

  res.status(201).json(
    new ApiResponse(
      201,
      { ticket: populatedTicket },
      "Ticket created successfully"
    )
  );
});

export const getTickets = asyncHandler(async (req, res) => {
  const {
    search,
    status,
    priority,
    assignedTo,
    sort = "updatedAt",
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      {
        subject: {
          $regex: search,
          $options: "i",
        },
      },
      {
        customerName: {
          $regex: search,
          $options: "i",
        },
      },
      {
        customerEmail: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (assignedTo) {
    query.assignedTo = assignedTo;
  }

  const skip = (Number(page) - 1) * Number(limit);

  let sortQuery = { updatedAt: -1 };

  if (sort === "priority") {
    sortQuery = {
      priority: -1,
      updatedAt: -1,
    };
  }

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .populate("assignedTo", "name email role")
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit)),

    Ticket.countDocuments(query),
  ]);

  const formattedTickets = tickets.map((ticket) => ({
    ...ticket.toObject(),
    isOverdue: getOverdueStatus(ticket),
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        tickets: formattedTickets,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Tickets fetched successfully"
    )
  );
});

export const getTicketById = asyncHandler(
  async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate(
        "activityHistory.performedBy",
        "name email role"
      )
      .populate("replies.author", "name email role");

    if (!ticket) {
      throw new ApiError(404, "Ticket not found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          ticket: {
            ...ticket.toObject(),
            isOverdue: getOverdueStatus(ticket),
          },
        },
        "Ticket fetched successfully"
      )
    );
  }
);

export const updateTicket = asyncHandler(
  async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new ApiError(404, "Ticket not found");
    }

    const {
      subject,
      description,
      priority,
      status,
    } = req.body;

    const activities = [];

    if (
      priority &&
      priority !== ticket.priority
    ) {
      activities.push({
        type: "priority_changed",
        message: `Priority changed from ${ticket.priority} to ${priority}`,
        performedBy: req.user._id,
      });

      ticket.priority = priority;
    }

    if (
      status &&
      status !== ticket.status
    ) {
      activities.push({
        type: "status_changed",
        message: `Status changed from ${ticket.status} to ${status}`,
        performedBy: req.user._id,
      });

      ticket.status = status;
    }

    if (subject) {
      ticket.subject = subject;
    }

    if (description) {
      ticket.description = description;
    }

    ticket.activityHistory.push(...activities);

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("assignedTo", "name email role")
      .populate(
        "activityHistory.performedBy",
        "name email role"
      )
      .populate("replies.author", "name email role");

    res.status(200).json(
      new ApiResponse(
        200,
        {
          ticket: {
            ...updatedTicket.toObject(),
            isOverdue: getOverdueStatus(updatedTicket),
          },
        },
        "Ticket updated successfully"
      )
    );
  }
);

export const assignTicket = asyncHandler(
  async (req, res) => {
    const { agentId } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new ApiError(404, "Ticket not found");
    }

    const agent = await User.findOne({
      _id: agentId,
      role: { $in: ["agent", "admin"] },
      isActive: true,
    });

    if (!agent) {
      throw new ApiError(
        404,
        "Active agent not found"
      );
    }

    ticket.assignedTo = agent._id;

    ticket.activityHistory.push({
      type: "assigned",
      message: `Ticket assigned to ${agent.name}`,
      performedBy: req.user._id,
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("assignedTo", "name email role")
      .populate(
        "activityHistory.performedBy",
        "name email role"
      );

    res.status(200).json(
      new ApiResponse(
        200,
        { ticket: updatedTicket },
        "Ticket assigned successfully"
      )
    );
  }
);

export const addReply = asyncHandler(
  async (req, res) => {
    const { content, type = "public" } = req.body;

    if (!content?.trim()) {
      throw new ApiError(
        400,
        "Reply content is required"
      );
    }

    if (!["public", "internal"].includes(type)) {
      throw new ApiError(
        400,
        "Invalid reply type"
      );
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new ApiError(404, "Ticket not found");
    }

    ticket.replies.push({
      content: content.trim(),
      author: req.user._id,
      type,
    });

    ticket.activityHistory.push({
      type: "reply_added",
      message:
        type === "internal"
          ? "Internal note added"
          : "Public reply added",
      performedBy: req.user._id,
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("assignedTo", "name email role")
      .populate(
        "activityHistory.performedBy",
        "name email role"
      )
      .populate(
        "replies.author",
        "name email role"
      );

    res.status(201).json(
      new ApiResponse(
        201,
        {
          ticket: {
            ...updatedTicket.toObject(),
            isOverdue: getOverdueStatus(updatedTicket),
          },
        },
        "Reply added successfully"
      )
    );
  }
);