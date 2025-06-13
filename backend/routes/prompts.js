const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Prompt = require("../models/Prompt")
const auth = require("../middleware/auth")
const geminiService = require("../services/geminiService")

const router = express.Router()

// Generate intelligent prompt using Gemini AI
router.post(
  "/generate",
  auth,
  [
    body("task").trim().isLength({ min: 1, max: 1000 }).withMessage("Task must be between 1 and 1000 characters"),
    body("role").optional().trim().isLength({ max: 50 }).withMessage("Role cannot exceed 50 characters"),
    body("tone")
      .optional()
      .isIn(["professional", "friendly", "casual", "formal", "enthusiastic", "technical", "creative", "analytical"]),
    body("format")
      .optional()
      .isIn(["paragraph", "bullet points", "table", "step-by-step guide", "code snippet", "essay", "list"]),
    body("category").optional().isIn(["general", "coding", "writing", "analysis", "creative", "business", "education"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const taskData = req.body

      let generatedPrompt

      // Try Gemini AI first
      if (geminiService.isAvailable()) {
        try {
          generatedPrompt = await geminiService.generateOptimizedPrompt(taskData)
          console.log("✅ Generated prompt using Gemini AI")
        } catch (geminiError) {
          console.error("Gemini generation failed, using fallback:", geminiError.message)
          generatedPrompt = generateFallbackPrompt(taskData)
        }
      } else {
        console.log("📝 Using fallback prompt generation")
        generatedPrompt = generateFallbackPrompt(taskData)
      }

      res.json({
        success: true,
        generatedPrompt,
        aiPowered: generatedPrompt.source === "gemini",
        message:
          generatedPrompt.source === "gemini"
            ? "Generated using Google Gemini AI"
            : "Generated using built-in optimization engine",
      })
    } catch (error) {
      console.error("Generate prompt error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while generating prompt",
      })
    }
  },
)

// Get prompt suggestions using Gemini AI
router.get("/suggestions/:category", auth, async (req, res) => {
  try {
    const { category } = req.params
    const { taskType } = req.query

    const suggestions = await geminiService.generatePromptSuggestions(category, taskType || "general")

    res.json({
      success: true,
      suggestions,
      category,
      aiPowered: geminiService.isAvailable(),
    })
  } catch (error) {
    console.error("Get suggestions error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching suggestions",
    })
  }
})

// Fallback prompt generation function (your existing logic)
function generateFallbackPrompt(taskData) {
  const { task, role, tone, format, dateContext, additionalContext, category } = taskData

  const analysis = analyzeTask(task, category)
  const optimizations = []
  let prompt = ""

  // Your existing prompt generation logic here...
  if (role) {
    const enhancedRole = enhanceRole(role, category, analysis.complexity)
    prompt += `${enhancedRole}\n\n`
    optimizations.push("Enhanced role definition with domain expertise")
  } else {
    const suggestedRole = suggestRole(category, analysis.taskType)
    prompt += `${suggestedRole}\n\n`
    optimizations.push("Auto-suggested optimal role based on task analysis")
  }

  const structuredTask = structureTask(task, analysis)
  prompt += `${structuredTask}\n\n`
  optimizations.push("Decomposed task into clear, actionable components")

  const formatInstructions = generateFormatInstructions(format, analysis.taskType, category)
  prompt += `${formatInstructions}\n\n`
  optimizations.push("Added specific output format guidelines")

  const qualityConstraints = generateQualityConstraints(tone, category, analysis.complexity)
  prompt += `${qualityConstraints}\n\n`
  optimizations.push("Included quality standards and constraints")

  if (analysis.needsExamples) {
    const exampleGuidance = generateExampleGuidance(category, analysis.taskType)
    prompt += `${exampleGuidance}\n\n`
    optimizations.push("Added example requirements for clarity")
  }

  if (additionalContext) {
    const contextIntegration = integrateAdditionalContext(additionalContext, analysis)
    prompt += `${contextIntegration}\n\n`
    optimizations.push("Integrated additional context strategically")
  }

  if (dateContext) {
    prompt += `Consider information and best practices available up to ${dateContext}.\n\n`
    optimizations.push("Added temporal context for accuracy")
  }

  const validationInstructions = generateValidationInstructions(category, analysis.taskType)
  prompt += `${validationInstructions}`
  optimizations.push("Added self-validation requirements")

  return {
    prompt: prompt.trim(),
    analysis,
    optimizations,
    confidence: calculateConfidence(analysis, optimizations.length),
    source: "fallback",
  }
}

// Keep all your existing helper functions (analyzeTask, enhanceRole, etc.)
function analyzeTask(task, category) {
  const taskLower = task.toLowerCase()
  let taskType = "general"

  if (taskLower.includes("code") || taskLower.includes("program") || taskLower.includes("function")) {
    taskType = "coding"
  } else if (taskLower.includes("write") || taskLower.includes("article") || taskLower.includes("content")) {
    taskType = "writing"
  } else if (taskLower.includes("analyze") || taskLower.includes("research") || taskLower.includes("study")) {
    taskType = "analysis"
  } else if (taskLower.includes("create") || taskLower.includes("design") || taskLower.includes("brainstorm")) {
    taskType = "creative"
  } else if (taskLower.includes("plan") || taskLower.includes("strategy") || taskLower.includes("business")) {
    taskType = "business"
  } else if (taskLower.includes("explain") || taskLower.includes("teach") || taskLower.includes("learn")) {
    taskType = "education"
  }

  const complexityIndicators = ["complex", "advanced", "detailed", "comprehensive", "in-depth", "thorough"]
  const complexity = complexityIndicators.some((indicator) => taskLower.includes(indicator))
    ? "high"
    : task.length > 100
      ? "medium"
      : "low"

  const needsExamples =
    taskLower.includes("example") || taskLower.includes("sample") || taskType === "coding" || complexity === "high"

  const requirements = extractRequirements(task)

  return {
    taskType,
    complexity,
    needsExamples,
    requirements,
    wordCount: task.split(" ").length,
    hasSpecificDomain: category !== "general",
  }
}

function extractRequirements(task) {
  const requirements = []
  const taskLower = task.toLowerCase()

  if (taskLower.includes("step by step") || taskLower.includes("steps")) {
    requirements.push("sequential_process")
  }
  if (taskLower.includes("example") || taskLower.includes("sample")) {
    requirements.push("examples_needed")
  }
  if (taskLower.includes("detailed") || taskLower.includes("comprehensive")) {
    requirements.push("detailed_output")
  }
  if (taskLower.includes("quick") || taskLower.includes("brief") || taskLower.includes("summary")) {
    requirements.push("concise_output")
  }
  if (taskLower.includes("beginner") || taskLower.includes("simple")) {
    requirements.push("beginner_friendly")
  }
  if (taskLower.includes("advanced") || taskLower.includes("expert")) {
    requirements.push("advanced_level")
  }

  return requirements
}

function enhanceRole(role, category, complexity) {
  const roleEnhancements = {
    coding: {
      low: "experienced software developer",
      medium: "senior software engineer with expertise in best practices",
      high: "principal software architect with deep technical knowledge",
    },
    writing: {
      low: "skilled content writer",
      medium: "professional copywriter with editorial experience",
      high: "expert content strategist and published author",
    },
    business: {
      low: "business professional",
      medium: "senior business consultant with industry experience",
      high: "executive business strategist with proven track record",
    },
    analysis: {
      low: "data analyst",
      medium: "senior research analyst with domain expertise",
      high: "principal data scientist and research expert",
    },
    creative: {
      low: "creative professional",
      medium: "senior creative director with diverse portfolio",
      high: "award-winning creative strategist and innovator",
    },
    education: {
      low: "knowledgeable instructor",
      medium: "experienced educator with curriculum expertise",
      high: "master educator and learning specialist",
    },
  }

  const enhancement = roleEnhancements[category]?.[complexity] || "knowledgeable professional"
  return `You are a ${enhancement} acting as a ${role}.`
}

function suggestRole(category, taskType) {
  const roleSuggestions = {
    coding:
      "You are a senior software engineer with expertise in clean code, best practices, and modern development methodologies.",
    writing:
      "You are a professional content strategist and skilled writer with expertise in creating engaging, well-structured content.",
    business:
      "You are a senior business consultant with extensive experience in strategy, operations, and market analysis.",
    analysis:
      "You are a senior research analyst with expertise in data interpretation, critical thinking, and comprehensive analysis.",
    creative:
      "You are a creative director with a proven track record in innovative thinking, design, and creative problem-solving.",
    education:
      "You are an expert educator with deep knowledge in pedagogy, curriculum design, and effective learning strategies.",
    general:
      "You are a knowledgeable professional with broad expertise and strong analytical and communication skills.",
  }

  return roleSuggestions[category] || roleSuggestions.general
}

function structureTask(task, analysis) {
  let structuredTask = "**Primary Objective:**\n"
  structuredTask += `${task}\n\n`

  if (analysis.requirements.length > 0) {
    structuredTask += "**Key Requirements:**\n"
    analysis.requirements.forEach((req) => {
      switch (req) {
        case "sequential_process":
          structuredTask += "- Provide a clear, step-by-step process\n"
          break
        case "examples_needed":
          structuredTask += "- Include relevant examples to illustrate points\n"
          break
        case "detailed_output":
          structuredTask += "- Provide comprehensive, detailed information\n"
          break
        case "concise_output":
          structuredTask += "- Keep response concise and to the point\n"
          break
        case "beginner_friendly":
          structuredTask += "- Explain concepts in beginner-friendly terms\n"
          break
        case "advanced_level":
          structuredTask += "- Provide advanced, expert-level insights\n"
          break
      }
    })
    structuredTask += "\n"
  }

  return structuredTask
}

function generateFormatInstructions(format, taskType, category) {
  const formatInstructions = {
    paragraph: "Structure your response in well-organized paragraphs with clear topic sentences and logical flow.",
    "bullet points":
      "Present information using clear, concise bullet points with consistent formatting and logical grouping.",
    table: "Organize information in a well-structured table with appropriate headers and clear categorization.",
    "step-by-step guide":
      "Create a numbered, sequential guide with clear action items and expected outcomes for each step.",
    "code snippet": "Provide clean, well-commented code with explanations of key concepts and best practices.",
    essay: "Write a structured essay with introduction, body paragraphs with supporting evidence, and conclusion.",
    list: "Create an organized list with clear hierarchy and consistent formatting throughout.",
  }

  let instruction = `**Output Format:**\n${formatInstructions[format] || formatInstructions.paragraph}\n\n`

  if (category === "coding" && format !== "code snippet") {
    instruction += "Include code examples where relevant, with proper syntax highlighting and comments.\n\n"
  } else if (category === "business") {
    instruction += "Include actionable insights and consider business impact in your formatting.\n\n"
  } else if (category === "education") {
    instruction += "Structure content for optimal learning with clear progression and knowledge checks.\n\n"
  }

  return instruction
}

function generateQualityConstraints(tone, category, complexity) {
  let constraints = "**Quality Standards:**\n"

  const toneConstraints = {
    professional: "Maintain a professional, authoritative tone with industry-standard terminology.",
    friendly: "Use a warm, approachable tone while maintaining expertise and credibility.",
    casual: "Adopt a conversational, relaxed tone that remains informative and helpful.",
    formal: "Use formal language with precise terminology and structured presentation.",
    enthusiastic: "Convey enthusiasm and energy while maintaining accuracy and professionalism.",
    technical: "Use precise technical language with detailed explanations of complex concepts.",
    creative: "Employ creative language and innovative approaches while staying focused on objectives.",
    analytical: "Use logical, data-driven language with clear reasoning and evidence-based conclusions.",
  }

  constraints += `- ${toneConstraints[tone] || toneConstraints.professional}\n`

  if (complexity === "high") {
    constraints += "- Provide comprehensive coverage with advanced insights and nuanced understanding\n"
    constraints += "- Include multiple perspectives and consider edge cases\n"
  } else if (complexity === "medium") {
    constraints += "- Balance depth with accessibility, providing solid coverage without overwhelming detail\n"
  } else {
    constraints += "- Focus on clarity and simplicity while ensuring completeness\n"
  }

  const categoryConstraints = {
    coding:
      "- Follow coding best practices and include error handling considerations\n- Explain the reasoning behind technical decisions\n",
    writing: "- Ensure proper grammar, style, and readability\n- Maintain consistent voice and messaging\n",
    business:
      "- Consider practical implementation and business impact\n- Include relevant metrics or KPIs where applicable\n",
    analysis: "- Support conclusions with evidence and logical reasoning\n- Acknowledge limitations and assumptions\n",
    creative:
      "- Balance creativity with practicality and feasibility\n- Provide multiple creative options when appropriate\n",
    education: "- Structure content for progressive learning\n- Include knowledge checks or reflection points\n",
  }

  constraints += categoryConstraints[category] || ""
  constraints += "\n"

  return constraints
}

function generateExampleGuidance(category, taskType) {
  const exampleTypes = {
    coding: "Include practical code examples with explanations of how they work and why they're effective.",
    writing: "Provide sample text or content pieces that demonstrate the concepts being discussed.",
    business: "Include real-world business scenarios or case studies that illustrate key points.",
    analysis: "Provide data examples or analytical frameworks that demonstrate the methodology.",
    creative: "Include creative examples or inspiration that showcase different approaches.",
    education: "Provide learning examples or exercises that reinforce the concepts being taught.",
  }

  return `**Examples and Illustrations:**\n${exampleTypes[category] || "Include relevant examples that clarify and support your main points."}\n\n`
}

function integrateAdditionalContext(additionalContext, analysis) {
  return `**Additional Context Considerations:**\n${additionalContext}\n\nEnsure your response addresses these specific context requirements while maintaining focus on the primary objective.\n\n`
}

function generateValidationInstructions(category, taskType) {
  let validation = "**Validation and Quality Check:**\n"
  validation += "Before finalizing your response, verify that you have:\n"
  validation += "- Addressed all aspects of the primary objective\n"
  validation += "- Followed the specified format and quality standards\n"
  validation += "- Provided accurate and up-to-date information\n"

  const categoryValidation = {
    coding:
      "- Ensured code is syntactically correct and follows best practices\n- Included proper error handling and edge case considerations\n",
    writing: "- Checked for grammar, style, and readability\n- Ensured consistent tone and messaging throughout\n",
    business:
      "- Verified practical applicability and business relevance\n- Considered implementation challenges and solutions\n",
    analysis: "- Supported all conclusions with evidence\n- Acknowledged any limitations or assumptions made\n",
    creative: "- Balanced creativity with feasibility\n- Provided actionable and implementable ideas\n",
    education:
      "- Structured content for optimal learning progression\n- Included clear explanations of complex concepts\n",
  }

  validation += categoryValidation[category] || ""
  return validation
}

function calculateConfidence(analysis, optimizationCount) {
  let confidence = 70
  if (analysis.hasSpecificDomain) confidence += 10
  if (analysis.requirements.length > 2) confidence += 10
  if (analysis.complexity === "high") confidence += 5
  confidence += Math.min(optimizationCount * 2, 20)
  return Math.min(confidence, 95)
}

// Get all prompts for authenticated user
router.get(
  "/",
  auth,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
    query("category")
      .optional()
      .isIn(["general", "coding", "writing", "analysis", "creative", "business", "education"]),
    query("search").optional().isLength({ max: 100 }).withMessage("Search term too long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit
      const { category, search } = req.query

      // Build query
      const query = { user: req.user._id }

      if (category) {
        query.category = category
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { task: { $regex: search, $options: "i" } },
          { generatedPrompt: { $regex: search, $options: "i" } },
        ]
      }

      // Get prompts with pagination
      const prompts = await Prompt.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")

      const total = await Prompt.countDocuments(query)

      res.json({
        success: true,
        prompts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      })
    } catch (error) {
      console.error("Get prompts error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while fetching prompts",
      })
    }
  },
)

// Create new prompt
router.post(
  "/",
  auth,
  [
    body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
    body("task").trim().isLength({ min: 1, max: 1000 }).withMessage("Task must be between 1 and 1000 characters"),
    body("role").optional().trim().isLength({ max: 50 }).withMessage("Role cannot exceed 50 characters"),
    body("tone")
      .optional()
      .isIn(["professional", "friendly", "casual", "formal", "enthusiastic", "technical", "creative", "analytical"]),
    body("format")
      .optional()
      .isIn(["paragraph", "bullet points", "table", "step-by-step guide", "code snippet", "essay", "list"]),
    body("category").optional().isIn(["general", "coding", "writing", "analysis", "creative", "business", "education"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { title, task, role, tone, format, dateContext, additionalContext, category, generatedPrompt } = req.body

      const prompt = new Prompt({
        user: req.user._id,
        title,
        task,
        role,
        tone,
        format,
        dateContext,
        additionalContext,
        generatedPrompt,
        category: category || "general",
      })

      await prompt.save()
      await prompt.populate("user", "name email")

      res.status(201).json({
        success: true,
        message: "Prompt created successfully",
        prompt,
      })
    } catch (error) {
      console.error("Create prompt error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while creating prompt",
      })
    }
  },
)

// Get single prompt
router.get("/:id", auth, async (req, res) => {
  try {
    const prompt = await Prompt.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name email")

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      })
    }

    res.json({
      success: true,
      prompt,
    })
  } catch (error) {
    console.error("Get prompt error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching prompt",
    })
  }
})

// Update prompt
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 and 100 characters"),
    body("task")
      .optional()
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Task must be between 1 and 1000 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const prompt = await Prompt.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { ...req.body, updatedAt: new Date() },
        { new: true },
      ).populate("user", "name email")

      if (!prompt) {
        return res.status(404).json({
          success: false,
          message: "Prompt not found",
        })
      }

      res.json({
        success: true,
        message: "Prompt updated successfully",
        prompt,
      })
    } catch (error) {
      console.error("Update prompt error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while updating prompt",
      })
    }
  },
)

// Delete prompt
router.delete("/:id", auth, async (req, res) => {
  try {
    const prompt = await Prompt.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      })
    }

    res.json({
      success: true,
      message: "Prompt deleted successfully",
    })
  } catch (error) {
    console.error("Delete prompt error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while deleting prompt",
    })
  }
})

// Increment usage count
router.post("/:id/use", auth, async (req, res) => {
  try {
    const prompt = await Prompt.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $inc: { usageCount: 1 } },
      { new: true },
    )

    if (!prompt) {
      return res.status(404).json({
        success: false,
        message: "Prompt not found",
      })
    }

    res.json({
      success: true,
      message: "Usage count updated",
      usageCount: prompt.usageCount,
    })
  } catch (error) {
    console.error("Update usage error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while updating usage",
    })
  }
})

module.exports = router
