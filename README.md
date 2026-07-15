# 🌾 OptiCrop

**Smart Agricultural Production Optimization Engine**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-1.7.6-orange.svg)](https://xgboost.readthedocs.io/)
[![ONNX](https://img.shields.io/badge/ONNX-1.15.0-lightgrey.svg)](https://onnx.ai/)

**OptiCrop** is an end‑to‑end AI/ML system that recommends the best crops based on soil and climate parameters. It serves three user personas:

- **Farmers** – receive the top‑3 crop recommendations with confidence scores and actionable tips.
- **Researchers/Agronomists** – assess a specific crop’s suitability with SHAP‑based explanations.
- **Policymakers/Analysts** – explore aggregated analytics and trends via interactive dashboards.

Built with a modern tech stack (React, FastAPI, XGBoost, ONNX, PostgreSQL, Redis) and deployed with Docker & Kubernetes, OptiCrop achieves **>90% model accuracy** with **<200ms inference latency** – ready for production at scale.

---

## ✨ Features

- **📊 Farmer Dashboard** – simple form to enter N, P, K, temperature, humidity, pH, rainfall. Displays top‑3 crops with confidence bars and cultivation tips.
- **🔬 Suitability Check** – evaluate a specific crop’s fitness. Visualises overall score and SHAP feature contributions (positive/negative impact).
- **📈 Analytics** – interactive charts showing crop distribution, yield‑vs‑rainfall correlations, and monthly yield trends (sample data – can be connected to your own API).
- **🤖 High‑Performance Inference** – XGBoost model converted to ONNX for CPU‑optimised, low‑latency predictions.
- **⚙️ MLOps Pipeline** – automated retraining (Apache Airflow) and data drift detection (Evidently AI) to keep the model accurate over time.
- **🧩 Extensible Architecture** – microservices design; easily add new data sources, models, or frontend modules.

---

## 🏗️ Architecture Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────────┐      ┌─────────────┐
│   React     │ ───▶ │   FastAPI   │ ───▶ │  Model Serving  │ ───▶ │  ONNX Model │
│  Frontend   │ ◀─── │   Backend   │ ◀─── │ (ONNX Runtime)  │ ◀─── │  + Scaler   │
└─────────────┘      └─────────────┘      └─────────────────┘      └─────────────┘
                            │                        │
                            ▼                        ▼
                    ┌─────────────┐          ┌─────────────┐
                    │  PostgreSQL │          │    Redis    │
                    │ (Logs, Meta)│          │   (Cache)   │
                    └─────────────┘          └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │    MLflow   │
                    │  + MinIO    │
                    │(Artifacts)  │
                    └─────────────┘
```

---

## 🚀 Quick Start

You can run OptiCrop either **with Docker** (recommended for production) or **locally** (for development).  
Choose the path that suits you best.

### Prerequisites

- **Python 3.10+** (for local runs)
- **Node.js 16+ & npm** (for frontend)
- **PostgreSQL** (>=12) and **Redis** (>=6) – if running locally
- **Docker** and **Docker Compose** (optional, for containerized setup)
- **Kaggle account** (to download the dataset)

---

### Option 1: Run with Docker (Simplest)

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/opticrop.git
   cd opticrop
   ```

2. **Place the dataset**  
   Download `Crop_recommendation.csv` from [Kaggle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) and put it in `ml_pipeline/data/`.

3. **Train the model** (inside a temporary container)

   ```bash
   docker compose run --rm ml-pipeline python models/xgboost_train.py
   ```

   This runs 50 Optuna trials, trains the XGBoost model, saves a `scaler.pkl` and converts the model to ONNX (`model.onnx`) in `ml_pipeline/artifacts/`.

4. **Launch all services**

   ```bash
   docker compose up --build
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API docs: http://localhost:8000/docs
   - MLflow UI: http://localhost:5000
   - MinIO console: http://localhost:9000 (credentials: `minioadmin`/`minioadmin`)

---

### Option 2: Run Locally (Manual, without Docker)

This is the approach you used – perfect for development.

#### 2.1 Set up Python environment

```bash
cd opti_crop
python -m venv venv
source venv/bin/activate   # or `venv\Scripts\activate` on Windows
pip install -r backend/requirements.txt
pip install -r model_serving/requirements.txt
pip install -r ml_pipeline/requirements.txt
```

#### 2.2 Set up PostgreSQL and Redis

- Install PostgreSQL and Redis via your package manager (e.g., Homebrew on macOS).
- Start the services:
  ```bash
  brew services start postgresql
  brew services start redis
  ```
- Create the database and user:
  ```sql
  CREATE USER opti_user WITH PASSWORD 'secure_pass';
  CREATE DATABASE opticrop OWNER opti_user;
  ```

#### 2.3 Prepare the model artifacts

- Place the dataset in `ml_pipeline/data/crop_recommendation.csv`.
- Generate data splits and train the model:
  ```bash
  cd ml_pipeline
  python -c "from data.loader import load_and_clean, save_splits; df = load_and_clean(); save_splits(df)"
  python models/xgboost_train.py
  cd ..
  ```

#### 2.4 Start the services

**Terminal 1 – Model Serving** (port 8001)

```bash
export MODEL_PATH=ml_pipeline/artifacts/model.onnx
export SCALER_PATH=ml_pipeline/artifacts/scaler.pkl
uvicorn model_serving.main:app --host 0.0.0.0 --port 8001
```

**Terminal 2 – Backend API** (port 8000)

```bash
export POSTGRES_HOST=localhost
export REDIS_URL=redis://localhost:6379
export MODEL_SERVING_URL=http://localhost:8001
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```

**Terminal 3 – Frontend** (port 3000)

```bash
cd frontend
npm install
npm start
```

#### 2.5 Open the app

Go to http://localhost:3000 – you’re ready to use OptiCrop!

---

## 📡 API Endpoints

| Method | Endpoint              | Description                                                                |
| ------ | --------------------- | -------------------------------------------------------------------------- |
| `POST` | `/api/v1/recommend`   | Get top‑3 crop recommendations for given soil/climate data.                |
| `POST` | `/api/v1/suitability` | Assess a specific crop’s suitability (returns score + SHAP contributions). |
| `GET`  | `/health`             | Health check for the backend.                                              |

Full interactive API documentation is available at `/docs` when the backend is running.

---

## 🧠 Model Training Pipeline

The machine learning pipeline is fully automated:

1. **Data cleaning** – imputation and outlier capping.
2. **Feature engineering** – creates derived features (sum, ratios, interactions).
3. **Stratified splitting** – train/validation/test (70/15/15).
4. **Hyperparameter optimisation** – Optuna (50 trials) for XGBoost (max_depth, learning_rate, n_estimators, subsample, colsample_bytree).
5. **Model training** – best model retrained on full training set.
6. **Evaluation** – must achieve >90% test accuracy.
7. **Scaler export** – `StandardScaler` fitted on training data saved as `scaler.pkl`.
8. **ONNX conversion** – model converted to ONNX for efficient CPU inference.
9. **MLflow tracking** – all experiments logged; best model registered with alias `Production`.

Retraining can be scheduled weekly via Apache Airflow (DAG included in `airflow/dags/`).

---

## 📊 Monitoring & MLOps

- **Data drift detection** – Evidently AI runs daily to compare incoming production data with training baseline; alerts triggered if drift > threshold.
- **Performance monitoring** – Prometheus + Grafana (metrics include latency, throughput, error rates).
- **Model registry** – MLflow stores all models, versions, and production aliases.
- **CI/CD** – GitHub Actions builds images, runs tests, and deploys to staging/production.

---

## 🛠️ Technology Stack

| Layer             | Tools                                                     |
| ----------------- | --------------------------------------------------------- |
| **Frontend**      | React 18, TypeScript, Tailwind CSS, Chart.js, Axios       |
| **Backend**       | Python 3.10, FastAPI, SQLAlchemy (async), Pydantic, httpx |
| **Database**      | PostgreSQL (relational), Redis (caching)                  |
| **Model Serving** | ONNX Runtime, FastAPI, Uvicorn                            |
| **ML Training**   | XGBoost, Scikit‑learn, Optuna, MLflow, ONNX               |
| **Orchestration** | Apache Airflow                                            |
| **Deployment**    | Docker, Docker Compose, Kubernetes                        |
| **Monitoring**    | Prometheus, Grafana, Evidently AI                         |
| **CI/CD**         | GitHub Actions                                            |
| **Storage**       | MinIO (S3‑compatible)                                     |

---

## 📁 Project Structure

```
opti_crop/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/           # route handlers (recommend, suitability)
│   │   ├── core/          # config, database session
│   │   ├── models/        # Pydantic schemas & SQLAlchemy ORM
│   │   ├── services/      # business logic, model client
│   │   └── utils/         # helpers, logging
│   └── Dockerfile
├── ml_pipeline/           # ML training & evaluation
│   ├── data/              # data loader, feature engineering
│   ├── models/            # XGBoost training + Optuna
│   ├── evaluation/        # metrics
│   └── artifacts/         # saved scaler.pkl & model.onnx
├── model_serving/         # ONNX runtime FastAPI server
│   ├── main.py
│   ├── preprocess.py
│   └── Dockerfile
├── frontend/              # React TypeScript app
│   ├── src/
│   │   ├── components/    # InputForm, ResultCard, GaugeChart
│   │   ├── pages/         # FarmerDashboard, SuitabilityPage, Analytics
│   │   └── services/      # API client
│   └── Dockerfile
├── airflow/               # Retraining DAG
│   └── dags/
├── deployment/            # Kubernetes manifests
└── docker-compose.yml
```

---

## 🔧 Configuration

All sensitive data (DB passwords, API keys) are managed via environment variables.  
Copy `.env.example` to `.env` and adjust as needed.

Key variables:

```bash
POSTGRES_USER=opti_user
POSTGRES_PASSWORD=secure_pass
POSTGRES_DB=opticrop
POSTGRES_HOST=localhost       # or postgres if using Docker
REDIS_URL=redis://localhost:6379
MODEL_SERVING_URL=http://localhost:8001
MLFLOW_TRACKING_URI=http://mlflow:5000
```

---

## 🧪 Testing

- **Unit tests** – `pytest backend/tests`
- **Integration tests** – require running services; use `pytest` with markers.
- **Load testing** – Locust script available in `tests/load_test.py` (simulate 500 concurrent users).

---

## 🚢 Deployment (Production)

### Kubernetes

Apply the manifests in `deployment/k8s/`:

```bash
kubectl apply -f namespace.yaml
kubectl apply -f .
```

The HPA (HorizontalPodAutoscaler) will auto‑scale the model‑serving pods based on CPU utilisation.

### CI/CD

On every push to `main`, GitHub Actions:

1. Runs tests.
2. Builds Docker images.
3. Pushes to your registry.
4. Deploys to staging/production using `kubectl set image`.

Update the image repository in the actions and k8s files to your own.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repo.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feat/my-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Dataset by [Atharva Ingle](https://www.kaggle.com/datasets/atharvaingle/crop-recommendation-dataset) on Kaggle.
- Built with the amazing open‑source tools: FastAPI, XGBoost, React, ONNX, and many more.

---

**OptiCrop** – putting AI to work for sustainable agriculture. 🌱

---

### 📧 Contact

For questions, feedback, or collaborations, reach out via GitHub Issues or at [eslavathpranak@gmail.com](mailto:eslavathpranak@gmail.com).
