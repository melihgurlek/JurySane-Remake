# JurySane: AI-Powered Legal Trial Simulation

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-green)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2%2B-blue)](https://reactjs.org)

An interactive AI-powered courtroom simulation where users can step into the roles of Defense Attorney or Prosecutor, while all other participants (Judge, Jury, Witnesses, Opposing Counsel) are played by sophisticated AI agents.

## 🎯 Features

- **Realistic Trial Simulation**: Experience authentic courtroom procedures with AI-powered participants
- **Multiple Role Playing**: Choose to play as Defense Attorney or Prosecutor
- **Dynamic Legal Decisions**: AI judges make real-time rulings on objections and procedural matters
- **Educational Focus**: Learn legal reasoning, trial strategy, and courtroom procedure
- **Multi-Agent AI System**: Each participant has unique personalities and behaviors
- **Real-time Interaction**: Seamless communication between user and AI agents

## 🏗️ Architecture

### Backend (Python)
- **FastAPI**: Modern, fast web framework for building APIs
- **LangChain**: Multi-agent framework for AI role-playing
- **Pydantic**: Data validation and settings management
- **ChromaDB**: Vector database for case law and precedent retrieval
- **OpenAI GPT-4**: Large language model for AI agents

### Frontend (TypeScript/React)
- **React 18**: Modern UI framework with hooks
- **TypeScript**: Type-safe JavaScript for better development
- **Tailwind CSS**: Utility-first CSS framework
- **React Query**: Data fetching and state management
- **Zustand**: Lightweight state management
- **Framer Motion**: Smooth animations and transitions

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+** ([Download](https://python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))

### Installation

#### Option 1: Automated Setup (Recommended)

**Windows:**
```bash
scripts\setup.bat
```

**macOS/Linux:**
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

#### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jurysane-remake.git
   cd jurysane-remake
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   # Install dependencies
   pip install fastapi langchain pydantic uvicorn openai python-dotenv chromadb pydantic-settings langchain-openai
   cd ..
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file in backend directory
   echo "OPENAI_API_KEY=your_api_key_here" > backend/.env
   ```

### Running the Application

#### Development Mode

**Start Backend Server:**
```bash
cd backend
python -m uvicorn jurysane.main:app --host 0.0.0.0 --port 8000 --reload
```

**Start Frontend Server (in a new terminal):**
```bash
cd frontend
npm run dev
```

**Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

#### Production Mode

```bash
# Backend
cd backend
uvicorn jurysane.main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm run build
npm run preview
```

### 🎨 New Modern UI

The application now features a completely redesigned, modern interface with:

- **Sleek Design**: Clean, professional legal aesthetics
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Interactive Components**: Smooth animations and hover effects
- **Accessibility**: WCAG AA compliant with keyboard navigation
- **Modern Pages**: 
  - Landing Page with hero section and features
  - Role Selection with interactive cards
  - Case Selection with advanced filtering
  - Trial Setup with comprehensive case information
  - Trial Page with integrated sidebar and chat
  - Evidence Management with gallery view
  - Trial History with performance analytics
  - Profile Page with user statistics and settings

### 🛠️ Development Commands

**Backend Development:**
```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Run with auto-reload
python -m uvicorn jurysane.main:app --reload --port 8000

# Run tests
pytest

# Format code
black jurysane/
```

**Frontend Development:**
```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Format code
npm run format
```

## 📖 Usage

1. **Start the Application**: Open http://localhost:3000 in your browser
2. **Choose Your Role**: Select either Defense Attorney or Prosecutor
3. **Begin Trial**: Start with the sample case (State v. Marcus Johnson)
4. **Interact**: Address different AI participants (Judge, Opposing Counsel, Witnesses, Jury)
5. **Navigate Trial Phases**: Progress through opening statements, witness examination, closing arguments, and verdict

### Trial Phases

1. **Setup**: Case preparation and role assignment
2. **Opening Statements**: Both sides present their case overview
3. **Witness Examination**: Direct and cross-examination of witnesses
4. **Closing Arguments**: Final arguments to the jury
5. **Jury Deliberation**: Jury considers evidence and arguments
6. **Verdict**: Final decision announcement

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
pytest --cov=jurysane --cov-report=html  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage  # With coverage
```

## 🛠️ Development

### Code Quality

**Backend:**
```bash
cd backend
black jurysane/  # Format code
isort jurysane/  # Sort imports
flake8 jurysane/  # Lint
mypy jurysane/   # Type checking
```

**Frontend:**
```bash
cd frontend
npm run format     # Format with Prettier
npm run lint       # ESLint
npm run type-check # TypeScript checking
```

### Project Structure

```
jurysane-remake/
├── backend/                 # Python FastAPI backend
│   ├── jurysane/
│   │   ├── agents/         # AI agent implementations
│   │   ├── api/            # FastAPI routes
│   │   ├── models/         # Pydantic data models
│   │   ├── services/       # Business logic
│   │   ├── data/           # Sample data
│   │   ├── config.py       # Configuration
│   │   └── main.py         # FastAPI app
│   ├── tests/              # Backend tests
│   └── pyproject.toml      # Python dependencies
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities
│   │   ├── store/          # State management
│   │   ├── types/          # TypeScript types
│   │   └── main.tsx        # React app entry
│   ├── tests/              # Frontend tests
│   └── package.json        # Node dependencies
├── scripts/                # Development scripts
├── docs/                   # Documentation
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required
OPENAI_API_KEY=your_api_key_here

# Optional
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=your-secret-key
LLM_PROVIDER=openai
LLM_MODEL=gpt-4-turbo-preview
API_PORT=8000
```

### API Documentation

When running in development mode, visit:
- **FastAPI Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for all new frontend code
- Write tests for new features
- Update documentation as needed
- Use conventional commits

## 📚 Educational Use

JurySane is designed for educational purposes to help users:
- Understand legal trial procedures
- Practice legal reasoning and argumentation
- Learn about the roles of different courtroom participants
- Experience the decision-making process in legal contexts

**Note**: This is a simulation for educational purposes only and does not constitute legal advice.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by real legal trial procedures and courtroom dynamics
- Built with modern AI and web technologies
- Designed for educational and training purposes

## 📞 Support

If you encounter any issues or have questions:
1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/yourusername/jurysane-remake/issues)
3. Create a [new issue](https://github.com/yourusername/jurysane-remake/issues/new)

---

**Happy practicing! ⚖️**
