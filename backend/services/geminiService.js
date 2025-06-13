const { GoogleGenerativeAI } = require("@google/generative-ai")

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️  GEMINI_API_KEY not provided. AI-powered generation will be disabled.")
      this.genAI = null
      return
    }

    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    console.log("✅ Gemini AI service initialized")
  }

  async generateOptimizedPrompt(taskData) {
    if (!this.genAI) {
      throw new Error("Gemini API not configured")
    }

    const { task, role, tone, format, dateContext, additionalContext, category } = taskData

    const systemPrompt = this.buildSystemPrompt()
    const userPrompt = this.buildUserPrompt(taskData)

    try {
      const result = await this.model.generateContent([{ text: systemPrompt }, { text: userPrompt }])

      const response = await result.response
      const generatedText = response.text()

      // Parse the structured response
      return this.parseGeminiResponse(generatedText, taskData)
    } catch (error) {
      console.error("Gemini API error:", error)
      throw new Error("Failed to generate optimized prompt with Gemini")
    }
  }

  buildSystemPrompt() {
    return `You are an expert AI prompt engineer with deep knowledge of how to create highly effective prompts for AI systems. Your expertise includes:

1. **Prompt Architecture**: Understanding the optimal structure for different types of AI tasks
2. **Context Engineering**: Knowing how to provide the right amount and type of context
3. **Role Definition**: Creating precise role definitions that enhance AI performance
4. **Output Specification**: Defining clear output formats and quality standards
5. **Constraint Design**: Adding appropriate constraints and validation requirements

Your task is to analyze user input and generate a highly optimized, professional-grade prompt that will produce superior results from any AI system.

**Response Format**: You must respond with a JSON object containing:
{
  "optimizedPrompt": "The complete optimized prompt",
  "analysis": {
    "taskType": "coding|writing|analysis|creative|business|education|general",
    "complexity": "low|medium|high",
    "keyRequirements": ["requirement1", "requirement2"],
    "suggestedImprovements": ["improvement1", "improvement2"]
  },
  "optimizations": [
    "List of specific optimizations applied"
  ],
  "confidence": 85,
  "reasoning": "Explanation of the optimization approach"
}

**Quality Standards**:
- Create prompts that are clear, specific, and actionable
- Include appropriate role definitions and context
- Specify output formats and quality requirements
- Add validation and self-checking instructions
- Optimize for the specific task type and complexity level
- Ensure the prompt will work well across different AI models`
  }

  buildUserPrompt(taskData) {
    const { task, role, tone, format, dateContext, additionalContext, category } = taskData

    return `Please analyze and optimize the following prompt request:

**Original Task**: ${task}
**Intended Role**: ${role || "Not specified"}
**Desired Tone**: ${tone}
**Output Format**: ${format}
**Category**: ${category}
**Date Context**: ${dateContext || "Not specified"}
**Additional Context**: ${additionalContext || "None"}

Create a highly optimized, professional-grade prompt that will produce superior results. Focus on:

1. **Clear Role Definition**: Enhance or create an appropriate expert role
2. **Structured Task Description**: Break down the task into clear, actionable components
3. **Context Integration**: Incorporate all relevant context effectively
4. **Output Specification**: Define precise output requirements and format
5. **Quality Standards**: Add appropriate quality constraints and validation
6. **Domain Expertise**: Apply best practices specific to the task category

The optimized prompt should be significantly more effective than a basic prompt and suitable for professional use.`
  }

  parseGeminiResponse(responseText, originalData) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in response")
      }

      const parsedResponse = JSON.parse(jsonMatch[0])

      // Validate required fields
      if (!parsedResponse.optimizedPrompt || !parsedResponse.analysis) {
        throw new Error("Invalid response structure")
      }

      return {
        prompt: parsedResponse.optimizedPrompt,
        analysis: {
          taskType: parsedResponse.analysis.taskType || "general",
          complexity: parsedResponse.analysis.complexity || "medium",
          keyRequirements: parsedResponse.analysis.keyRequirements || [],
          suggestedImprovements: parsedResponse.analysis.suggestedImprovements || [],
          wordCount: parsedResponse.optimizedPrompt.split(" ").length,
          hasSpecificDomain: originalData.category !== "general",
        },
        optimizations: parsedResponse.optimizations || [],
        confidence: parsedResponse.confidence || 75,
        reasoning: parsedResponse.reasoning || "AI-optimized prompt generation",
        source: "gemini",
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error)
      // Fallback: use the raw response as the prompt
      return {
        prompt: responseText,
        analysis: {
          taskType: originalData.category || "general",
          complexity: "medium",
          keyRequirements: ["AI-generated optimization"],
          suggestedImprovements: [],
          wordCount: responseText.split(" ").length,
          hasSpecificDomain: originalData.category !== "general",
        },
        optimizations: ["AI-powered prompt optimization"],
        confidence: 70,
        reasoning: "Generated using Gemini AI with fallback parsing",
        source: "gemini-fallback",
      }
    }
  }

  async optimizeExistingPrompt(prompt) {
    if (!this.genAI) {
      throw new Error("Gemini API not configured")
    }

    const optimizationPrompt = `You are an expert prompt engineer. Analyze and optimize the following prompt:

**Original Prompt**: ${prompt}

Please provide an optimized version that:
1. Improves clarity and specificity
2. Adds appropriate structure and formatting
3. Includes quality standards and constraints
4. Enhances the likelihood of getting better AI responses

Respond with a JSON object:
{
  "optimizedPrompt": "The improved prompt",
  "improvements": ["list of specific improvements made"],
  "qualityScore": {
    "original": 65,
    "optimized": 85
  },
  "reasoning": "Explanation of optimization approach"
}`

    try {
      const result = await this.model.generateContent(optimizationPrompt)
      const response = await result.response
      const generatedText = response.text()

      const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      throw new Error("Invalid response format")
    } catch (error) {
      console.error("Gemini optimization error:", error)
      throw new Error("Failed to optimize prompt with Gemini")
    }
  }

  async generatePromptSuggestions(category, taskType) {
    if (!this.genAI) {
      return this.getFallbackSuggestions(category, taskType)
    }

    const suggestionPrompt = `Generate 5 high-quality prompt examples for the category "${category}" and task type "${taskType}".

Each prompt should be professional-grade and demonstrate best practices for that specific domain.

Respond with a JSON array:
[
  {
    "title": "Prompt title",
    "prompt": "Complete optimized prompt",
    "useCase": "When to use this prompt"
  }
]`

    try {
      const result = await this.model.generateContent(suggestionPrompt)
      const response = await result.response
      const generatedText = response.text()

      const jsonMatch = generatedText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }

      return this.getFallbackSuggestions(category, taskType)
    } catch (error) {
      console.error("Gemini suggestions error:", error)
      return this.getFallbackSuggestions(category, taskType)
    }
  }

  getFallbackSuggestions(category, taskType) {
    const suggestions = {
      coding: [
        {
          title: "Code Review Assistant",
          prompt:
            "You are a senior software engineer conducting a code review. Analyze the following code for best practices, potential bugs, security issues, and performance optimizations. Provide specific, actionable feedback with examples.",
          useCase: "When you need thorough code analysis and improvement suggestions",
        },
      ],
      writing: [
        {
          title: "Content Strategy Expert",
          prompt:
            "You are a professional content strategist with expertise in audience engagement and SEO. Create compelling, well-structured content that resonates with the target audience while maintaining brand voice and achieving specific objectives.",
          useCase: "When creating marketing content or articles",
        },
      ],
      business: [
        {
          title: "Strategic Business Consultant",
          prompt:
            "You are a senior business consultant with extensive experience in strategy development and market analysis. Provide data-driven insights and actionable recommendations that consider market dynamics, competitive landscape, and business objectives.",
          useCase: "When developing business strategies or analyzing market opportunities",
        },
      ],
    }

    return suggestions[category] || suggestions.coding
  }

  isAvailable() {
    return this.genAI !== null
  }
}

module.exports = new GeminiService()
