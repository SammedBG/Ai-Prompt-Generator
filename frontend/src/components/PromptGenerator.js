"use client"

import { useState, useEffect } from "react"
import api from "../services/api"

const PromptGenerator = ({ onPromptSaved }) => {
  const [promptData, setPromptData] = useState({
    title: "",
    task: "",
    role: "",
    tone: "professional",
    format: "paragraph",
    dateContext: "",
    additionalContext: "",
    category: "general",
  })
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [promptAnalysis, setPromptAnalysis] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [aiPowered, setAiPowered] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const tones = [
    { value: "professional", label: "Professional" },
    { value: "friendly", label: "Friendly" },
    { value: "casual", label: "Casual" },
    { value: "formal", label: "Formal" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "technical", label: "Technical" },
    { value: "creative", label: "Creative" },
    { value: "analytical", label: "Analytical" },
  ]

  const formats = [
    { value: "paragraph", label: "Paragraph" },
    { value: "bullet points", label: "Bullet Points" },
    { value: "table", label: "Table" },
    { value: "step-by-step guide", label: "Step-by-Step Guide" },
    { value: "code snippet", label: "Code Snippet" },
    { value: "essay", label: "Essay" },
    { value: "list", label: "List" },
  ]

  const categories = [
    { value: "general", label: "General" },
    { value: "coding", label: "Coding" },
    { value: "writing", label: "Writing" },
    { value: "analysis", label: "Analysis" },
    { value: "creative", label: "Creative" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
  ]

  // Enhanced generatePrompt function with Gemini AI
  const generatePrompt = async () => {
    const { task } = promptData

    if (!task.trim()) {
      setGeneratedPrompt("")
      setPromptAnalysis(null)
      setAiPowered(false)
      return
    }

    setIsGenerating(true)
    try {
      const response = await api.post("/prompts/generate", promptData)
      setGeneratedPrompt(response.data.generatedPrompt.prompt)
      setPromptAnalysis(response.data.generatedPrompt)
      setAiPowered(response.data.aiPowered)

      if (response.data.aiPowered) {
        setMessage("✨ Generated using Google Gemini AI for maximum accuracy!")
      } else {
        setMessage("📝 Generated using built-in optimization engine")
      }

      setTimeout(() => setMessage(""), 5000)
    } catch (error) {
      console.error("Error generating prompt:", error)
      setMessage("Failed to generate prompt. Please try again.")
      setAiPowered(false)
    } finally {
      setIsGenerating(false)
    }
  }

  // Load suggestions when category changes
  const loadSuggestions = async (category) => {
    try {
      const response = await api.get(`/prompts/suggestions/${category}`)
      setSuggestions(response.data.suggestions || [])
    } catch (error) {
      console.error("Error loading suggestions:", error)
    }
  }

  const useSuggestion = (suggestion) => {
    setPromptData((prev) => ({
      ...prev,
      title: suggestion.title,
      task: suggestion.prompt.substring(0, 200) + "...", // Truncate for the task field
    }))
  }

  // Only generate when task changes meaningfully (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (promptData.task.trim().length > 10) {
        generatePrompt()
      } else {
        setGeneratedPrompt("")
        setPromptAnalysis(null)
        setAiPowered(false)
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [promptData.task]) // Only depend on task changes

  // Load suggestions when category changes
  useEffect(() => {
    if (promptData.category) {
      loadSuggestions(promptData.category)
    }
  }, [promptData.category])

  // Manual generation trigger for other field changes
  const handleFieldChange = (field, value) => {
    setPromptData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Only auto-regenerate for significant changes
    if (field === "category" || field === "tone" || field === "format") {
      if (promptData.task.trim().length > 10) {
        setTimeout(() => generatePrompt(), 500)
      }
    }
  }

  const savePrompt = async () => {
    if (!promptData.title.trim()) {
      setMessage("Please enter a title for your prompt")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    if (!generatedPrompt.trim()) {
      setMessage("Please generate a prompt first")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const response = await api.post("/prompts", {
        ...promptData,
        generatedPrompt,
      })

      setMessage("✅ Prompt saved successfully!")

      // Notify parent component that a prompt was saved
      if (onPromptSaved) {
        onPromptSaved()
      }

      setTimeout(() => {
        setMessage("")
      }, 3000)
    } catch (error) {
      console.error("Save error:", error)
      setMessage(error.response?.data?.message || "❌ Failed to save prompt. Please try again.")
      setTimeout(() => setMessage(""), 5000)
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setMessage("Prompt copied to clipboard!")
    } catch (err) {
      setMessage("Failed to copy prompt")
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Configuration</h2>
          {aiPowered && (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
              <span>✨</span>
              <span>Gemini AI Powered</span>
            </div>
          )}
        </div>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes("success") || message.includes("copied") || message.includes("Gemini")
                ? "bg-green-100 text-green-700 border border-green-400"
                : "bg-red-100 text-red-700 border border-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Suggested Prompts for {promptData.category}
            </h3>
            <div className="space-y-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-3 rounded border flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{suggestion.useCase}</p>
                  </div>
                  <button
                    onClick={() =>
                      setPromptData((prev) => ({
                        ...prev,
                        title: suggestion.title,
                        task: suggestion.prompt.substring(0, 200) + "...", // Truncate for the task field
                      }))
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt Title</label>
            <input
              type="text"
              value={promptData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Give your prompt a descriptive title..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Task or Query *</label>
            <textarea
              value={promptData.task}
              onChange={(e) => handleFieldChange("task", e.target.value)}
              placeholder="Describe what you want the AI to help you with..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Role</label>
              <input
                type="text"
                value={promptData.role}
                onChange={(e) => handleFieldChange("role", e.target.value)}
                placeholder="e.g., Expert Developer, Marketing Specialist..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <select
                value={promptData.category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response Tone</label>
              <select
                value={promptData.tone}
                onChange={(e) => handleFieldChange("tone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {tones.map((tone) => (
                  <option key={tone.value} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Output Format</label>
              <select
                value={promptData.format}
                onChange={(e) => handleFieldChange("format", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Context</label>
            <input
              type="date"
              value={promptData.dateContext}
              onChange={(e) => handleFieldChange("dateContext", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Context
            </label>
            <textarea
              value={promptData.additionalContext}
              onChange={(e) => handleFieldChange("additionalContext", e.target.value)}
              placeholder="Any additional context, constraints, or specific requirements..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      {promptAnalysis && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🧠 {aiPowered ? "Gemini AI Analysis" : "AI Analysis"} & Optimizations
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-200">Task Type:</span>
              <span className="ml-2 capitalize text-blue-700 dark:text-blue-300">
                {promptAnalysis.analysis.taskType}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-200">Complexity:</span>
              <span className="ml-2 capitalize text-blue-700 dark:text-blue-300">
                {promptAnalysis.analysis.complexity}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-200">Confidence:</span>
              <span className="ml-2 text-blue-700 dark:text-blue-300">{promptAnalysis.confidence}%</span>
            </div>
            {promptAnalysis.reasoning && (
              <div>
                <span className="font-medium text-blue-800 dark:text-blue-200">AI Reasoning:</span>
                <p className="ml-2 text-blue-700 dark:text-blue-300 text-xs mt-1">{promptAnalysis.reasoning}</p>
              </div>
            )}
            <div>
              <span className="font-medium text-blue-800 dark:text-blue-200">Applied Optimizations:</span>
              <ul className="ml-4 mt-1 space-y-1">
                {promptAnalysis.optimizations.map((opt, index) => (
                  <li key={index} className="text-blue-700 dark:text-blue-300 text-xs">
                    • {opt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Preview Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isGenerating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>🤖 {aiPowered ? "Gemini AI" : "AI"} Generating...</span>
            </div>
          ) : (
            "Generated Prompt"
          )}
        </h2>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-h-[200px] relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-600 dark:text-blue-400">
                  {aiPowered ? "Gemini AI analyzing and optimizing..." : "Analyzing and optimizing..."}
                </span>
              </div>
            </div>
          )}
          <textarea
            value={generatedPrompt}
            readOnly
            className="w-full h-full min-h-[180px] bg-transparent border-none resize-none focus:outline-none text-gray-900 dark:text-white"
            placeholder="Your AI-optimized prompt will appear here..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={copyToClipboard}
            disabled={!generatedPrompt}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium disabled:cursor-not-allowed"
          >
            📋 Copy
          </button>

          <button
            onClick={savePrompt}
            disabled={!generatedPrompt || loading}
            className={`${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium disabled:cursor-not-allowed transition-colors`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "💾 Save"
            )}
          </button>

          {aiPowered && (
            <div className="flex items-center space-x-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-3 py-2 rounded-md text-sm">
              <span>⚡</span>
              <span>AI Enhanced</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PromptGenerator
