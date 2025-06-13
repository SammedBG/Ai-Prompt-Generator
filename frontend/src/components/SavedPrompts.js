"use client"

import { useState, useEffect } from "react"
import api from "../services/api"

const SavedPrompts = () => {
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState("")

  const categories = [
    { value: "", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "coding", label: "Coding" },
    { value: "writing", label: "Writing" },
    { value: "analysis", label: "Analysis" },
    { value: "creative", label: "Creative" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
  ]

  const fetchPrompts = async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      })

      if (searchTerm) params.append("search", searchTerm)
      if (categoryFilter) params.append("category", categoryFilter)

      const response = await api.get(`/prompts?${params}`)
      setPrompts(response.data.prompts)
      setTotalPages(response.data.pagination.pages)
      setCurrentPage(page)
    } catch (error) {
      setMessage("Failed to fetch prompts")
    } finally {
      setLoading(false)
    }
  }

  const refreshPrompts = () => {
    fetchPrompts(1)
  }

  useEffect(() => {
    fetchPrompts()
  }, [searchTerm, categoryFilter])

  const copyToClipboard = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setMessage("Prompt copied to clipboard!")
      setTimeout(() => setMessage(""), 3000)
    } catch (err) {
      setMessage("Failed to copy prompt")
    }
  }

  const deletePrompt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) {
      return
    }

    try {
      await api.delete(`/prompts/${id}`)
      setMessage("Prompt deleted successfully")
      fetchPrompts(currentPage)
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to delete prompt")
    }
  }

  const optimizePrompt = async (prompt) => {
    try {
      const response = await api.post("/optimize", { prompt: prompt.generatedPrompt })

      // Show optimization results in a modal or alert
      const improvement = response.data.metrics.improvementScore
      const optimizedPrompt = response.data.optimizedPrompt

      if (improvement > 0) {
        const useOptimized = window.confirm(
          `Optimization complete! Quality improved by ${improvement} points.\n\n` +
            `Original: ${prompt.generatedPrompt.substring(0, 100)}...\n\n` +
            `Optimized: ${optimizedPrompt.substring(0, 100)}...\n\n` +
            `Would you like to copy the optimized version?`,
        )

        if (useOptimized) {
          await copyToClipboard(optimizedPrompt)
        }
      } else {
        setMessage("This prompt is already well-optimized!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Failed to optimize prompt")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.includes("success") || message.includes("copied")
              ? "bg-green-100 text-green-700 border border-green-400"
              : "bg-red-100 text-red-700 border border-red-400"
          }`}
        >
          {message}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompts Grid */}
      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No prompts found</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {searchTerm || categoryFilter
              ? "Try adjusting your search or filter criteria."
              : "Create your first prompt to get started!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {prompt.title || "Untitled Prompt"}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{prompt.category}</span>
                  <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{prompt.task}</div>

              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm max-h-32 overflow-y-auto mb-4">
                {prompt.generatedPrompt}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(prompt.generatedPrompt)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => optimizePrompt(prompt)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    🚀 Optimize
                  </button>
                </div>
                <button
                  onClick={() => deletePrompt(prompt._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => fetchPrompts(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="flex items-center px-4 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchPrompts(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default SavedPrompts
