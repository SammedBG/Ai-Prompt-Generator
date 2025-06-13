# AI Prompt Generator

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT">
  <img src="https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/powered%20by-Gemini%20AI-blueviolet.svg" alt="Powered by Gemini AI">
</div>

<div align="center">
  <h3>Create high-quality, AI-optimized prompts for ChatGPT, Claude, Gemini, and other AI tools</h3>
  <p>Powered by Google's Gemini AI for maximum accuracy and effectiveness</p>
</div>

## 🚀 Features

### 🧠 AI-Powered Prompt Engineering
- **Gemini AI Integration**: Leverages Google's Gemini 1.5 Flash model for intelligent prompt generation
- **Advanced Analysis**: Analyzes task type, complexity, and requirements for optimal prompt structure
- **Smart Optimization**: Applies professional prompt engineering techniques automatically
- **Confidence Scoring**: Provides quality metrics and improvement suggestions

### 💼 Comprehensive Prompt Management
- **Save & Organize**: Store your best prompts with full CRUD operations
- **Categorization**: Organize prompts by category (coding, writing, business, etc.)
- **Search & Filter**: Find prompts by title, content, or category
- **Usage Tracking**: Track how often each prompt is used

### 🎨 User Experience
- **Real-time Preview**: See your prompt generated as you type
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Full theme switching support
- **Prompt Suggestions**: AI-generated prompt templates by category

### 🔒 Security & Authentication
- **JWT Authentication**: Secure user registration and login
- **Data Protection**: User-specific prompt storage and access
- **API Security**: Rate limiting, CORS protection, and input validation

## 📁 Project Structure

\`\`\`
prompt-generator-fullstack/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Prompt.js
│   │   └── Template.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── prompts.js
│   │   └── optimize.js
│   ├── services/
│   │   └── geminiService.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   ├── components/
│   │   │   ├── PromptGenerator.js
│   │   │   ├── SavedPrompts.js
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   └── services/
│   │       └── api.js
│   ├── public/
│   │   └── index.html
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
\\\

## 📋 Tech Stack

### Frontend
- React.js
- TailwindCSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Google Generative AI SDK (@google/generative-ai)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API key

### Clone the Repository
```bash
git clone [https://github.com/yourusername/ai-prompt-generator.git](https://github.com/SammedBG/Ai-Prompt-Generator.git)
cd ai-prompt-generator
```

### Install Dependencies
\`\`\`bash
# Install root dependencies
npm install

# Install all dependencies (frontend and backend)
npm run install-deps
\`\`\`

## ⚙️ Configuration

### Backend Configuration
Create a `.env` file in the `backend` directory (copy from `.env.example`):

\`\`\`env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prompt_generator

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Google Gemini API Key (required for AI-enhanced optimization)
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### Frontend Configuration
Create a `.env` file in the `frontend` directory (copy from `.env.example`):

\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

## 🚀 Running the Application

### Development Mode
\`\`\`bash
# Start both frontend and backend
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
\`\`\`

### Production Mode
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the key to your backend `.env` file as `GEMINI_API_KEY`

## 📱 Usage Guide

### Creating a Prompt

1. **Sign in** to your account
2. Navigate to the **Create Prompt** tab
3. Enter your **task description** (what you want the AI to do)
4. Optionally specify:
   - **AI Role** (e.g., "Expert Developer", "Marketing Specialist")
   - **Category** (e.g., Coding, Writing, Business)
   - **Tone** (e.g., Professional, Friendly, Technical)
   - **Format** (e.g., Paragraph, Bullet Points, Code Snippet)
   - **Date Context** (for time-sensitive information)
   - **Additional Context** (any extra details)
5. The AI will **automatically generate** an optimized prompt
6. **Save** your prompt for future use

### Managing Prompts

1. Navigate to the **Saved Prompts** tab
2. **Search or filter** your prompts by category
3. **Copy** prompts to clipboard for use with AI tools
4. **Optimize** existing prompts for better results
5. **Delete** prompts you no longer need

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Prompts
- `GET /api/prompts` - Get user's prompts (with pagination, search, filter)
- `POST /api/prompts` - Create new prompt
- `GET /api/prompts/:id` - Get single prompt
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt
- `POST /api/prompts/:id/use` - Increment usage count
- `POST /api/prompts/generate` - Generate AI-optimized prompt
- `GET /api/prompts/suggestions/:category` - Get prompt suggestions by category

### Optimization
- `POST /api/optimize` - Optimize an existing prompt
- `GET /api/optimize/tips` - Get optimization tips

## 🧠 Gemini AI Integration

The application uses Google's Gemini 1.5 Flash model to generate high-quality prompts. The integration:

1. **Analyzes your input** to understand task type, complexity, and requirements
2. **Applies prompt engineering techniques** based on best practices
3. **Structures the prompt** with appropriate role definitions, context, and constraints
4. **Provides detailed analysis** of the generated prompt
5. **Falls back gracefully** to built-in optimization if Gemini is unavailable

### Example Transformation

**Basic Input:**
\`\`\`
"Help me write better code"
\`\`\`

**Gemini-Enhanced Output:**
\`\`\`
You are a senior software engineer with expertise in clean code principles, 
software architecture, and modern development practices.

**Primary Objective:**
Improve code quality through comprehensive analysis and actionable recommendations

**Key Requirements:**
- Analyze code structure, readability, and maintainability
- Identify potential bugs, security vulnerabilities, and performance issues
- Provide specific, implementable improvements with examples
- Follow industry best practices and coding standards

**Output Format:**
Provide a structured code review with clear sections for different types of improvements. Include before/after code examples where applicable.

**Quality Standards:**
- Use precise technical language with detailed explanations
- Support recommendations with reasoning and best practice references
- Prioritize improvements by impact and implementation difficulty
- Include actionable next steps for implementation

**Validation and Quality Check:**
Before finalizing your response, verify that you have:
- Identified specific areas for improvement with clear explanations
- Provided concrete examples and code snippets where relevant
- Ensured all recommendations follow current industry standards
- Included implementation guidance and potential challenges
\`\`\`

## 🚀 Deployment

### Backend Deployment (Railway/Render)
1. Create a new Web Service on your preferred hosting platform
2. Connect your repository
3. Set the following environment variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or as per your hosting provider)
   - `MONGODB_URI=your_production_mongodb_uri`
   - `JWT_SECRET=your_production_jwt_secret`
   - `FRONTEND_URL=https://your-frontend-domain.com`
   - `GEMINI_API_KEY=your_gemini_api_key`

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository to Vercel or Netlify
2. Set environment variables:
   - `REACT_APP_API_URL=https://your-backend-domain.com/api`

## 🛠️ Troubleshooting

### Common Issues

1. **Gemini AI not working**
   - Ensure your API key is correctly set in the backend `.env` file
   - Check if you have exceeded your API quota
   - Verify that your network can reach Google's API servers

2. **Failed to save prompts**
   - Ensure MongoDB is running and accessible
   - Check that you're logged in with a valid authentication token
   - Verify prompt data meets validation requirements

3. **Authentication issues**
   - Clear browser cookies and local storage
   - Ensure JWT_SECRET is properly set
   - Check for CORS issues if frontend and backend are on different domains

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Google Generative AI](https://ai.google.dev/) for the Gemini API
- [React.js](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [MongoDB](https://www.mongodb.com/) for the database
- [TailwindCSS](https://tailwindcss.com/) for styling

---

<div align="center">
  <p>© 2025 AI Prompt Generator</p>
</div>
\`\`\`

The README.md file has been updated to match your project's structure and implementation! I've made several key improvements:

1. ✅ **Accurate project structure** - Now reflects the actual file structure of your application
2. ✅ **Correct API endpoints** - All API routes match what's implemented in your backend
3. ✅ **Proper environment variables** - Lists the exact environment variables your app needs
4. ✅ **Detailed Gemini integration** - Clear explanation of how the Google Gemini AI integration works
5. ✅ **Installation instructions** - Step-by-step setup that works with your project
6. ✅ **Troubleshooting section** - Common issues users might encounter and how to solve them

Is there any specific section you'd like me to expand on or any other changes you'd like to make to the README?
