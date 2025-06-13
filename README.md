# AI Prompt Generator - Full Stack Application

A comprehensive web application for generating high-quality prompts for AI tools like ChatGPT, Claude, and Gemini.

## 🚀 Features

### Frontend (React + Next.js)
- **Dynamic Prompt Generation**: Real-time prompt creation based on user inputs
- **Role-Based Prompts**: Choose from various professional roles
- **Tone & Format Customization**: Multiple tone and format options
- **Save & Manage**: Save prompts with full CRUD operations
- **Search & Filter**: Find prompts by category and search terms
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode**: Full theme switching support
- **Prompt Optimization**: AI-enhanced prompt improvement

### Backend (Node.js + Express + MongoDB)
- **REST API**: Complete CRUD operations for prompts
- **JWT Authentication**: Secure user registration and login
- **Data Validation**: Input validation and sanitization
- **Rate Limiting**: API protection against abuse
- **Error Handling**: Comprehensive error management
- **Security**: Helmet, CORS, and other security measures

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
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── layout.jsx
│   │   │   └── page.jsx
│   │   ├── components/
│   │   │   ├── PromptGenerator.jsx
│   │   │   ├── PromptForm.jsx
│   │   │   ├── PromptPreview.jsx
│   │   │   ├── SavedPrompts.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── lib/
│   │       └── api.js
│   ├── .env.example
│   └── package.json
└── package.json
\`\`\`

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account or local MongoDB
- npm or yarn

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd prompt-generator-fullstack
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm run install-deps
\`\`\`

### 3. Environment Setup

#### Backend Environment
\`\`\`bash
cd backend
cp .env.example .env
\`\`\`

Edit `backend/.env`:
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prompt_generator
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:3000
\`\`\`

#### Frontend Environment
\`\`\`bash
cd frontend
cp .env.example .env.local
\`\`\`

Edit `frontend/.env.local`:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=AI Prompt Generator
\`\`\`

### 4. Database Setup

#### MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database named `prompt_generator`
4. Get your connection string
5. Add it to `backend/.env`

#### Local MongoDB
\`\`\`bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Update MONGODB_URI in backend/.env
MONGODB_URI=mongodb://localhost:27017/prompt_generator
\`\`\`

### 5. Run the Application

#### Development Mode
\`\`\`bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
\`\`\`

#### Production Mode
\`\`\`bash
npm run build
npm start
\`\`\`

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

### Optimization
- `POST /api/optimize` - Optimize a prompt
- `GET /api/optimize/tips` - Get optimization tips

## 📊 Database Schema

### Users Collection
\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Prompts Collection
\`\`\`javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  title: String,
  task: String,
  role: String,
  tone: String (enum),
  format: String (enum),
  dateContext: String,
  additionalContext: String,
  generatedPrompt: String,
  category: String (enum),
  isPublic: Boolean,
  likes: Number,
  usageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## 🚀 Deployment

### Backend Deployment (Railway/Render)

#### Railway
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically

#### Render
1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables

### Frontend Deployment (Vercel/Netlify)

#### Vercel
1. Connect your GitHub repository
2. Set root directory to `frontend`
3. Set environment variables
4. Deploy

#### Netlify
1. Connect your repository
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/.next`
4. Add environment variables

### Environment Variables for Production

#### Backend
\`\`\`env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
\`\`\`

#### Frontend
\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_APP_NAME=AI Prompt Generator
\`\`\`

## 🔧 Development

### Adding New Features
1. Create feature branch
2. Add backend routes if needed
3. Update frontend components
4. Test thoroughly
5. Submit pull request

### Code Style
- Use ESLint for JavaScript linting
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic

## 🧪 Testing

### Backend Testing
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Testing
\`\`\`bash
cd frontend
npm test
\`\`\`

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@promptgenerator.com or create an issue on GitHub.
