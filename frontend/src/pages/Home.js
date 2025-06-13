"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">AI Prompt Generator</h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Create high-quality prompts for ChatGPT, Claude, Gemini, and other AI tools. Optimize your prompts for
            better results with our intelligent generator.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Targeted Prompts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate prompts tailored to specific roles, tones, and formats for optimal AI responses.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">💾</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Save & Organize</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Save your best prompts, organize by category, and reuse them whenever needed.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Preview</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your prompt generated in real-time as you adjust parameters and settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
