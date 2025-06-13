const mongoose = require("mongoose")

const promptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    task: {
      type: String,
      required: [true, "Task is required"],
      trim: true,
      maxlength: [1000, "Task cannot exceed 1000 characters"],
    },
    role: {
      type: String,
      trim: true,
      maxlength: [50, "Role cannot exceed 50 characters"],
    },
    tone: {
      type: String,
      enum: ["professional", "friendly", "casual", "formal", "enthusiastic", "technical", "creative", "analytical"],
      default: "professional",
    },
    format: {
      type: String,
      enum: ["paragraph", "bullet points", "table", "step-by-step guide", "code snippet", "essay", "list"],
      default: "paragraph",
    },
    dateContext: {
      type: String,
      trim: true,
    },
    additionalContext: {
      type: String,
      trim: true,
      maxlength: [500, "Additional context cannot exceed 500 characters"],
    },
    generatedPrompt: {
      type: String,
      required: true,
      maxlength: [2000, "Generated prompt cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      enum: ["general", "coding", "writing", "analysis", "creative", "business", "education"],
      default: "general",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
promptSchema.index({ user: 1, createdAt: -1 })
promptSchema.index({ category: 1, isPublic: 1 })
promptSchema.index({ title: "text", task: "text" })

module.exports = mongoose.model("Prompt", promptSchema)
