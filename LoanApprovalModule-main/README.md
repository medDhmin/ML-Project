# 🏦 Loan Approval Prediction System

A full-stack machine learning application that predicts loan approval decisions in real-time. This project combines a **FastAPI backend** with a trained ML model and a **React frontend** with a premium user interface to deliver instant loan eligibility predictions.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

This application provides an intelligent loan approval prediction system that analyzes applicant data including personal information, financial metrics, and credit history to determine loan eligibility. The system uses a pre-trained machine learning model to deliver predictions with probability scores.

**Key Capabilities:**
- Real-time loan approval predictions
- Probability scoring for decision confidence
- Interactive form with intelligent validation
- Automatic Loan-to-Income (LTI) ratio calculation
- Premium, responsive user interface

---

## 🏗️ Architecture

The system follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  React Frontend │ ──────> │  FastAPI Backend │ ──────> │   ML Model      │
│   (Vite + CSS)  │  HTTP   │   (Python 3.10+) │  Joblib │  (scikit-learn) │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        │                            │
   Vercel Proxy                  VPS/Docker
   (CORS handling)              (Port 22017)
```

### Components:

1. **Frontend (React + Vite)**
   - User-facing web application
   - Form validation and data collection
   - Real-time LTI calculation
   - Result visualization with modals

2. **Backend (FastAPI)**
   - RESTful API endpoints
   - Model inference engine
   - Data preprocessing and encoding
   - Prediction probability calculation

3. **ML Model (scikit-learn)**
   - Pre-trained classification model
   - Label encoders for categorical features
   - Saved as `.joblib` files for persistence

---

## ✨ Features

### Frontend Features

- **🎨 Premium UI/UX**: Dark-themed design with glassmorphism effects and smooth animations
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **✅ Smart Validation**:
  - Age validation (non-negative)
  - Work experience cannot exceed age
  - Credit history duration cannot exceed age
  - Mandatory field enforcement
- **🧮 Auto-calculation**: Real-time Loan-to-Income ratio computation
- **🎭 Interactive Modals**: Welcome screen and result display with animations
- **📊 Eligibility Preview**: Live preview card showing approval likelihood

### Backend Features

- **🚀 Fast API**: High-performance asynchronous endpoints
- **🤖 ML Inference**: Real-time predictions using trained model
- **🔄 Data Encoding**: Automatic categorical variable transformation
- **📈 Probability Scores**: Confidence levels for predictions
- **🐳 Docker Support**: Containerized deployment
- **🌐 CORS Enabled**: Cross-origin request handling

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite 7** | Build tool and dev server |
| **Vanilla CSS** | Custom styling |
| **Vercel** | Hosting and deployment |

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | Runtime environment |
| **FastAPI** | Web framework |
| **Uvicorn** | ASGI server |
| **scikit-learn** | ML model framework |
| **pandas** | Data manipulation |
| **numpy** | Numerical operations |
| **joblib** | Model serialization |
| **Docker** | Containerization |

---

## 📁 Project Structure

```
LoanApprovalModule-main/
├── src/                          # Frontend source code
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # App-specific styles
│   ├── EligibilityPreviewCard.jsx # Preview component
│   ├── ResultModal.jsx           # Result display modal
│   ├── WelcomeModal.jsx          # Welcome screen
│   ├── InfoTooltip.jsx           # Tooltip component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # React entry point
├── public/                       # Static assets
├── dist/                         # Production build output
├── package.json                  # Frontend dependencies
├── vite.config.js               # Vite configuration
├── vercel.json                  # Vercel deployment config
├── index.html                   # HTML template
└── README.md                    # This file

Backend (separate deployment):
├── main.py                      # FastAPI application
├── loan_approval_model.joblib   # Trained ML model
├── label_encoders.joblib        # Feature encoders
├── requirements.txt             # Python dependencies
└── Dockerfile                   # Docker configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ (for backend)
- **Git**

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LoanApprovalModule-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Backend Setup

1. **Install Python dependencies**
   ```bash
   pip install fastapi uvicorn scikit-learn pandas numpy joblib
   ```

2. **Ensure model files exist**
   - `loan_approval_model.joblib`
   - `label_encoders.joblib`

3. **Run the API server**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 22017
   ```

---

## 📡 API Documentation

### Base URL
```
Production: http://161.97.70.41:22017
Development: http://localhost:22017
```

### Endpoints

#### `GET /`
Health check endpoint to verify API status.

**Response:**
```json
{
  "message": "Loan Approval API is running"
}
```

#### `POST /predict`
Predict loan approval based on applicant data.

**Request Body:**
```json
{
  "person_age": 30,
  "person_income": 50000,
  "person_emp_exp": 5,
  "loan_amnt": 10000,
  "loan_int_rate": 5.5,
  "loan_percent_income": 0.2,
  "cb_person_cred_hist_length": 8,
  "credit_score": 700,
  "person_gender": "Male",
  "person_education": "Bachelor",
  "person_home_ownership": "RENT",
  "loan_intent": "PERSONAL",
  "previous_loan_defaults_on_file": "No"
}
```

**Response:**
```json
{
  "approved": true,
  "probability": 0.87,
  "message": "Prêt approuvé"
}
```

---

## 🌐 Deployment

### Frontend (Vercel)

The frontend is deployed on **Vercel** with automatic CORS handling via proxy configuration.

**vercel.json:**
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://161.97.70.41:22017/:path*"
    }
  ]
}
```

This configuration proxies all `/api/*` requests to the backend server, preventing CORS issues.

### Backend (VPS + Docker)

The backend is deployed on a **VPS** using **Docker** and exposed via **DuckDNS** for domain management.

**Deployment Steps:**
1. Build Docker image
2. Run container on port 22017
3. Configure DuckDNS domain
4. Set up reverse proxy (optional)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

Developed as part of a Machine Learning project demonstrating end-to-end ML application development.

---

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React team for the powerful UI library
- scikit-learn for ML capabilities
- Vercel for seamless deployment
