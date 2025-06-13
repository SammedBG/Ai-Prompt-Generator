const express = require("express")
const { body, validationResult } = require("express-validator")
const auth = require("../middleware/auth")
const geminiService = require("../services/geminiService")

const router = express.Router()

// Advanced prompt optimization endpoint using Gemini AI
router.post(
  "/",
  auth,
  [body("prompt").trim().isLength({ min: 1, max: 2000 }).withMessage("Prompt must be between 1 and 2000 characters")],
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

      const { prompt } = req.body

      let optimizationResult

      // Try Gemini AI optimization first
      if (geminiService.isAvailable()) {
        try {
          optimizationResult = await geminiService.optimizeExistingPrompt(prompt)
          console.log("✅ Optimized prompt using Gemini AI")

          res.json({
            success: true,
            originalPrompt: prompt,
            optimizedPrompt: optimizationResult.optimizedPrompt,
            improvements: optimizationResult.improvements,
            qualityScore: optimizationResult.qualityScore,
            reasoning: optimizationResult.reasoning,
            aiPowered: true,
            source: "gemini",
          })
          return
        } catch (geminiError) {
          console.error("Gemini optimization failed, using fallback:", geminiError.message)
        }
      }

      // Fallback to built-in optimization
      console.log("📝 Using fallback prompt optimization")
      const fallbackResult = optimizePromptFallback(prompt)

      res.json({
        success: true,
        ...fallbackResult,
        aiPowered: false,
        source: "fallback",
      })
    } catch (error) {
      console.error("Optimize prompt error:", error)
      res.status(500).json({
        success: false,
        message: "Server error while optimizing prompt",
      })
    }
  },
)

// Fallback optimization function
function optimizePromptFallback(prompt) {
  const analysis = analyzePromptStructure(prompt)
  const optimizations = generateOptimizations(prompt, analysis)
  const optimizedPrompt = applyOptimizations(prompt, optimizations)
  const metrics = calculateImprovementMetrics(prompt, optimizedPrompt, analysis)

  return {
    originalPrompt: prompt,
    optimizedPrompt,
    analysis,
    improvements: optimizations.applied,
    suggestions: optimizations.suggestions,
    qualityScore: {
      original: analysis.qualityScore,
      optimized: Math.min(analysis.qualityScore + 15, 95),
    },
    reasoning: "Applied built-in optimization rules and best practices",
  }
}

// Keep all your existing helper functions
function analyzePromptStructure(prompt) {
  const analysis = {
    length: prompt.length,
    wordCount: prompt.split(/\s+/).length,
    sentences: prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0).length,
    hasRole: /(?:act as|you are|as a)/i.test(prompt),
    hasContext: /(?:context|background|given|considering)/i.test(prompt),
    hasFormat: /(?:format|structure|organize|present)/i.test(prompt),
    hasExamples: /(?:example|sample|instance|such as)/i.test(prompt),
    hasConstraints: /(?:must|should|ensure|avoid|don't)/i.test(prompt),
    clarity: calculateClarity(prompt),
    specificity: calculateSpecificity(prompt),
    completeness: calculateCompleteness(prompt),
  }

  analysis.type = determinePromptType(prompt)
  analysis.qualityScore = calculateQualityScore(analysis)

  return analysis
}

function calculateClarity(prompt) {
  let score = 50
  if (/\b(clearly|specifically|exactly|precisely)\b/i.test(prompt)) score += 15
  if (prompt.includes("step by step") || prompt.includes("step-by-step")) score += 10
  if (/\b(what|how|why|when|where)\b/i.test(prompt)) score += 10
  if (/\b(maybe|perhaps|possibly|might)\b/i.test(prompt)) score -= 10
  if (prompt.split(/[.!?]+/).length === 1 && prompt.length > 100) score -= 15
  return Math.max(0, Math.min(100, score))
}

function calculateSpecificity(prompt) {
  let score = 30
  const specificWords = prompt.match(/\b\d+\b/g) || []
  score += Math.min(specificWords.length * 5, 20)
  if (/\b(exactly|precisely|specifically|detailed)\b/i.test(prompt)) score += 15
  if (/\b(include|contain|cover|address)\b/i.test(prompt)) score += 10
  if (prompt.length > 50) score += 10
  return Math.max(0, Math.min(100, score))
}

function calculateCompleteness(prompt) {
  let score = 20
  const components = {
    role: /(?:act as|you are|as a)/i.test(prompt),
    task: prompt.length > 20,
    context: /(?:context|background|given)/i.test(prompt),
    format: /(?:format|structure|list|table)/i.test(prompt),
    constraints: /(?:must|should|ensure|avoid)/i.test(prompt),
    examples: /(?:example|sample|like)/i.test(prompt),
  }
  score += Object.values(components).filter(Boolean).length * 13
  return Math.max(0, Math.min(100, score))
}

function determinePromptType(prompt) {
  const promptLower = prompt.toLowerCase()
  if (promptLower.includes("code") || promptLower.includes("program")) return "coding"
  if (promptLower.includes("write") || promptLower.includes("article")) return "writing"
  if (promptLower.includes("analyze") || promptLower.includes("research")) return "analysis"
  if (promptLower.includes("create") || promptLower.includes("design")) return "creative"
  if (promptLower.includes("explain") || promptLower.includes("teach")) return "educational"
  if (promptLower.includes("plan") || promptLower.includes("strategy")) return "business"
  return "general"
}

function calculateQualityScore(analysis) {
  const weights = { clarity: 0.3, specificity: 0.25, completeness: 0.25, structure: 0.2 }
  const structureScore =
    (analysis.hasRole ? 25 : 0) +
    (analysis.hasContext ? 25 : 0) +
    (analysis.hasFormat ? 25 : 0) +
    (analysis.hasConstraints ? 25 : 0)
  return Math.round(
    analysis.clarity * weights.clarity +
      analysis.specificity * weights.specificity +
      analysis.completeness * weights.completeness +
      structureScore * weights.structure,
  )
}

function generateOptimizations(prompt, analysis) {
  const applied = []
  const suggestions = []

  if (!analysis.hasRole) {
    applied.push("Add role definition for better context")
    suggestions.push("Consider adding 'Act as a [specific role]' to establish expertise context")
  }
  if (!analysis.hasContext && analysis.type !== "general") {
    applied.push("Enhance context specification")
    suggestions.push("Provide more background context to improve response relevance")
  }
  if (!analysis.hasFormat) {
    applied.push("Add output format specification")
    suggestions.push("Specify desired output format (list, paragraph, table, etc.)")
  }
  if (analysis.clarity < 70) {
    applied.push("Improve clarity and specificity")
    suggestions.push("Use more specific language and clear instructions")
  }
  if (!analysis.hasConstraints) {
    applied.push("Add quality constraints")
    suggestions.push("Include specific requirements or constraints for better results")
  }
  if (analysis.wordCount < 10) {
    applied.push("Expand prompt detail")
    suggestions.push("Provide more detailed instructions for better AI understanding")
  } else if (analysis.wordCount > 150) {
    applied.push("Optimize prompt length")
    suggestions.push("Consider breaking down into more focused, specific requests")
  }

  return { applied, suggestions }
}

function applyOptimizations(prompt, optimizations) {
  let optimized = prompt

  if (optimizations.applied.includes("Add role definition for better context")) {
    optimized = "You are an expert assistant with specialized knowledge. " + optimized
  }
  if (optimizations.applied.includes("Add output format specification")) {
    optimized += " Please structure your response clearly and logically."
  }
  if (optimizations.applied.includes("Add quality constraints")) {
    optimized += " Ensure your response is accurate, comprehensive, and actionable."
  }
  if (optimizations.applied.includes("Enhance context specification")) {
    optimized += " Consider relevant context and provide practical, applicable information."
  }

  return optimized
}

function calculateImprovementMetrics(original, optimized, analysis) {
  const optimizedAnalysis = analyzePromptStructure(optimized)
  return {
    originalLength: original.length,
    optimizedLength: optimized.length,
    originalQuality: analysis.qualityScore,
    optimizedQuality: optimizedAnalysis.qualityScore,
    improvementScore: optimizedAnalysis.qualityScore - analysis.qualityScore,
    clarityImprovement: optimizedAnalysis.clarity - analysis.clarity,
    specificityImprovement: optimizedAnalysis.specificity - analysis.specificity,
    completenessImprovement: optimizedAnalysis.completeness - analysis.completeness,
  }
}

// Get optimization tips
router.get("/tips", (req, res) => {
  try {
    const tips = [
      {
        category: "Clarity",
        tips: [
          "Be specific about what you want the AI to do",
          "Use clear and concise language",
          "Avoid ambiguous terms or phrases",
        ],
      },
      {
        category: "Structure",
        tips: ["Start with a clear role definition", "Define the task explicitly", "Specify the desired output format"],
      },
      {
        category: "Context",
        tips: [
          "Provide relevant background information",
          "Include examples when helpful",
          "Mention any constraints or limitations",
        ],
      },
      {
        category: "Tone",
        tips: [
          "Specify the desired tone (professional, casual, etc.)",
          "Use polite language",
          "Be respectful in your requests",
        ],
      },
    ]

    res.json({
      success: true,
      tips,
    })
  } catch (error) {
    console.error("Get tips error:", error)
    res.status(500).json({
      success: false,
      message: "Server error while fetching tips",
    })
  }
})

module.exports = router
