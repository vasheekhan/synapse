Synapse
A modern AI-powered workspace for structured, actionable AI interactions.
�
￼ ￼ 

📖 About
Synapse is a full-stack AI-powered productivity workspace designed to explore a better way of interacting with AI-generated responses.
Most AI applications rely heavily on conversation. Users often need to send multiple follow-up prompts to perform simple and predictable tasks such as:
Summarizing a response
Extracting important points
Finding action items
Explaining complex information
Asking a new question
Synapse explores a structured + conversational AI interface, where common actions are available directly through the UI while users can still interact with AI freely.
Make common AI actions one click away without limiting conversational flexibility.
✨ Core Concept
Instead of requiring users to repeatedly type:
"Summarize this."

"Give me the key points."

"What are the action items?"

"Explain this in simple terms."
Synapse explores dedicated actions:
┌───────────────────────────────────────────────┐
│                 AI RESPONSE                   │
│                                               │
│  Generated response appears here...           │
│                                               │
├───────────────────────────────────────────────┤
│ Summary │ Key Points │ Action Items │ Explain │
│                                               │
│                    Ask AI                     │
└───────────────────────────────────────────────┘
This creates two interaction paths:
Structured Interaction
Users can quickly select a predefined action.
Conversational Interaction
Users can still ask the AI anything using Ask AI.
This combination aims to make AI interfaces faster, clearer, and more intuitive.
🚀 Features
🤖 AI-Powered Interaction
Interact with AI through a modern conversational interface designed for productivity workflows.
📝 Structured AI Actions
Synapse explores dedicated actions for common AI operations.
Summary
Convert long responses into concise summaries.
Key Points
Extract the most important information from an AI response.
Action Items
Identify tasks, next steps, or important actions from generated content.
Explain
Get a simpler or more understandable explanation of complex information.
Ask AI
Continue the conversation and ask any custom question.
📄 Rich Content Editing
Synapse provides a rich editing environment for working with structured content and documents.
🔐 Authentication
The application includes authentication and user-management functionality, including:
Email/password authentication
JWT-based authentication
Google OAuth
Session handling
Password hashing
☁️ Media & Communication
The backend integrates external services for application functionality, including:
Cloudinary for media management
Email services
WebSocket-based communication
🏗️ Architecture
Synapse follows a full-stack architecture with independently developed frontend and backend applications.
SYNAPSE
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
       ┌───────────┐                 ┌───────────┐
       │ Frontend  │                 │  Backend  │
       │           │                 │           │
       │ React     │◄──── HTTP ─────►│ Express   │
       │ TypeScript│                 │ TypeScript│
       │ Vite      │◄── WebSocket ──►│ Node.js   │
       └───────────┘                 └─────┬─────┘
                                           │
                                           ▼
                                     ┌───────────┐
                                     │  Prisma   │
                                     └─────┬─────┘
                                           │
                                           ▼
                                     ┌───────────┐
                                     │ MySQL /   │
                                     │ MariaDB   │
                                     └───────────┘
🛠️ Technology Stack
Frontend
Technology
Purpose
React
UI development
TypeScript
Type-safe development
Vite
Development and build tooling
Tailwind CSS
Styling
Tiptap
Rich text editing
React Router
Client-side routing
Axios
API communication
Lucide React
UI icons
Backend
Technology
Purpose
Node.js
Runtime environment
Express
Backend API framework
TypeScript
Type-safe backend development
Prisma
Database ORM
MySQL / MariaDB
Database
WebSockets
Real-time communication
JWT
Authentication
Passport
Authentication strategies
Zod
Validation
External Services
Service
Purpose
Cloudinary
Media management
Nodemailer
Email functionality
Resend
Email delivery
📁 Project Structure
Synapse/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── Backend/
│   ├── api/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── ...
│   ├── package.json
│   ├── prisma.config.ts
│   └── ...
│
├── README.md
└── ...
The structure may evolve as the project grows.
⚙️ Getting Started
Prerequisites
Make sure you have:
Node.js
npm
Git
MySQL or MariaDB
1. Clone the Repository
git clone https://github.com/vasheekhan/synapse.git
cd synapse
2. Setup the Backend
cd Backend
npm install
Create a .env file and configure the required environment variables.
Example:
DATABASE_URL=
JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
Never commit secrets or API keys to GitHub.
3. Setup the Database
npx prisma generate
npx prisma migrate dev
4. Start the Backend
npm run dev
5. Setup the Frontend
Open a new terminal:
cd Frontend
npm install
Create the frontend environment file if required and configure the backend/API URL.
Example:
VITE_API_URL=
Start the development server:
npm run dev
🌐 Live Demo
Try the deployed version:
https://synapse-66a9.vercel.app/
The live deployment may require authentication depending on the current configuration.
🎯 Product Philosophy
Synapse is built around a simple UX principle:
AI should understand what users want, but users shouldn't have to repeatedly explain common actions.
Many AI workflows contain predictable operations:
Read response
     │
     ├── Summarize
     │
     ├── Extract key points
     │
     ├── Find action items
     │
     ├── Explain
     │
     └── Ask something else
These actions can be represented directly in the interface.
This allows AI to remain conversational while also becoming more structured and task-oriented.
🔬 Problem Statement
Current conversational AI interfaces often require users to manually describe simple follow-up operations.
For example:
User:
"Explain distributed systems."

AI:
[Long response]

User:
"Summarize it."

AI:
[Summary]

User:
"Give me the key points."

AI:
[Key points]

User:
"Give me the action items."

AI:
[Action items]
The user repeatedly communicates intent that the system could potentially expose through the UI.
Synapse explores an alternative:
AI Response
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Summary       Key Points     Action Items
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                      Explain
                         │
                         ▼
                      Ask AI
💡 Design Goals
1. Reduce unnecessary prompts
Common operations should require fewer interactions.
2. Improve discoverability
Users should immediately understand what they can do with an AI response.
3. Keep AI conversational
Structured actions should complement, not replace, free-form AI conversations.
4. Improve productivity
Users should be able to transform information into useful outputs quickly.
5. Make AI responses actionable
AI output should not simply be something users read. It should be something users can work with.
🔮 Future Roadmap
Streaming AI responses
More structured AI actions
Custom AI actions
Context-aware actions
AI response history
Response bookmarking
AI-generated task creation
AI-powered document analysis
Improved collaboration
Workspace-level AI context
Advanced accessibility
Performance optimization
Better mobile experience
🤝 Contributing
Contributions and suggestions are welcome.
Fork the repository.
Create a feature branch.
Make your changes.
Test your changes.
Commit your work.
Open a Pull Request.
git checkout -b feature/your-feature

git add .

git commit -m "feat: add your feature"

git push origin feature/your-feature
🧪 Development
Before submitting changes, make sure to:
Test frontend functionality.
Test backend APIs.
Verify authentication flows.
Check database operations.
Check responsive layouts.
Verify environment variables are not exposed.
🔒 Security
Please do not commit:
API keys
Passwords
Database credentials
OAuth secrets
JWT secrets
Private tokens
.env files containing sensitive information
If you discover a security issue, please report it privately rather than opening a public issue.
📊 Project Status
Status: Active Development
Synapse is a personal full-stack project and prototype focused on experimenting with AI-powered productivity experiences and structured AI interactions.
The architecture and feature set may change as development continues.
👨‍💻 Author
Vashee Khan
Full-stack developer interested in:
Artificial Intelligence
Developer Tools
Productivity Software
User Experience
Full-Stack Development
GitHub:
https://github.com/vasheekhan
📬 Feedback
Have an idea or suggestion?
Feel free to open an issue or start a discussion in the repository.
Feedback is especially welcome around:
AI interaction design
User experience
Performance
Accessibility
Productivity workflows
📄 License
This project is currently a personal prototype and demonstration project.
License details may be added as the project evolves.
�

Built with curiosity, experimentation, and a focus on better AI experiences.
Synapse
