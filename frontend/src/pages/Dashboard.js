"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import PromptGenerator from "../components/PromptGenerator"
import SavedPrompts from "../components/SavedPrompts"

const Dashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("create")
  const [refreshSavedPrompts, setRefreshSavedPrompts] = useState(0)

  // Function to refresh saved prompts when a new prompt is saved
  const handlePromptSaved = () => {
    setRefreshSavedPrompts((prev) => prev + 1)
    // Optionally switch to saved prompts tab
    // setActiveTab("saved")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Create and manage your AI prompts</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("create")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "create"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                Create Prompt
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "saved"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                Saved Prompts
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "create" && <PromptGenerator onPromptSaved={handlePromptSaved} />}
            {activeTab === "saved" && <SavedPrompts key={refreshSavedPrompts} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
