# Loan Approval API (FastAPI)

API FastAPI qui permet de prédire si un prêt est **approuvé** ou **rejeté**, à partir d’un modèle ML entraîné et sauvegardé avec `joblib`.

Le backend charge :
- `loan_approval_model.joblib` : modèle de classification
- `label_encoders.joblib` : encodeurs de colonnes catégorielles (LabelEncoder)

---

## ✨ Fonctionnalités

- Endpoint `POST /predict` pour obtenir :
  - `approved` (bool)
  - `probability` (float)
  - `message` ("Prêt approuvé" ou "Prêt rejeté")
- Endpoint `GET /` pour vérifier que l’API tourne
- Déploiement sur **VPS** avec **Docker**
- Exposition via un **domaine gratuit DuckDNS** 

---

## 🧱 Tech Stack

- Python 3.10+ (recommandé)
- FastAPI
- Uvicorn
- scikit-learn (ou librairie ML utilisée)
- pandas, numpy
- joblib

---





# Loan Prediction App - Frontend

A modern, responsive web application designed to predict loan eligibility based on user-provided financial and personal data. This frontend integrates with a machine learning API to provide real-time predictions.

## 🚀 Features

- **Real-time Prediction**: Leverages a remote API to predict loan approval probability.
- **Dynamic Form Calculation**: Automatically calculates the Loan-to-Income (LTI) ratio as you type.
- **Form Validation**:
  - Ensures age is non-negative.
  - Validates that work experience does not exceed age.
  - Validates that credit history duration does not exceed age.
  - Mandatory field checks for all critical financial data.
- **Premium UI/UX**: Built with a sleek, dark-themed design featuring smooth transitions and micro-animations.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

## 🛠️ Tech Stack

- **React**: Core library for building the user interface.
- **Vite**: Ultra-fast build tool and development server.
- **Vanilla CSS**: Custom-crafted styles for a unique and premium look.
- **Vercel**: Deployment and API proxy management.

## ⚙️ Configuration & Deployment

### Vercel Proxy (CORS Prevention)

To prevent Cross-Origin Resource Sharing (CORS) issues when communicating with the backend API, the project uses a `vercel.json` configuration. This file sets up a rewrite rule that proxies requests from `/api/*` to the remote backend server.

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


