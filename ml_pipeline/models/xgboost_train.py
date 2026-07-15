import os
import optuna
import xgboost as xgb
from sklearn.metrics import f1_score, accuracy_score
import mlflow
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import LabelEncoder
import numpy as np
import onnx
import onnxmltools
from onnxmltools.convert.common.data_types import FloatTensorType
import pandas as pd

def objective(trial, X_train, y_train, X_val, y_val):
    param = {
        'max_depth': trial.suggest_int('max_depth', 3, 10),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'n_estimators': trial.suggest_int('n_estimators', 100, 1000),
        'subsample': trial.suggest_float('subsample', 0.6, 1.0),
        'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0),
        'random_state': 42,
        'eval_metric': 'mlogloss'
    }
    model = xgb.XGBClassifier(**param)
    model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
    preds = model.predict(X_val)
    return f1_score(y_val, preds, average='macro')

if __name__ == "__main__":
    # 1. Setup Directories
    os.makedirs('artifacts', exist_ok=True)
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data')
    
    # 2. Load Data matrices
    X_train = pd.read_csv(os.path.join(data_dir, 'train_X.csv')).values
    y_train = pd.read_csv(os.path.join(data_dir, 'train_y.csv')).values.ravel()
    X_val = pd.read_csv(os.path.join(data_dir, 'val_X.csv')).values
    y_val = pd.read_csv(os.path.join(data_dir, 'val_y.csv')).values.ravel()
    X_test = pd.read_csv(os.path.join(data_dir, 'test_X.csv')).values
    y_test = pd.read_csv(os.path.join(data_dir, 'test_y.csv')).values.ravel()

    # 3. Fit Target Encodings
    le = LabelEncoder()
    y_train = le.fit_transform(y_train)
    y_val = le.transform(y_val)
    y_test = le.transform(y_test)
    joblib.dump(le, 'artifacts/label_encoder.pkl')

    # 4. Fit Data Scaling (And transform splits so the model trains on scaled features)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_val = scaler.transform(X_val)
    X_test = scaler.transform(X_test)
    joblib.dump(scaler, 'artifacts/scaler.pkl')

    # 5. Hyperparameter Optimization Tuning Session
    study = optuna.create_study(direction='maximize')
    study.optimize(lambda trial: objective(trial, X_train, y_train, X_val, y_val), n_trials=50)

    # 6. Train Final Evaluated Model Configuration
    best_params = study.best_params
    best_model = xgb.XGBClassifier(**best_params, random_state=42, eval_metric='mlogloss')
    best_model.fit(X_train, y_train)

    # 7. Evaluate Metrics Test Run
    acc = accuracy_score(y_test, best_model.predict(X_test))
    print(f"Final Tuned Test Accuracy: {acc}")

    # 8. Export Structure to Target ONNX runtime format file
    initial_type = [('float_input', FloatTensorType([None, X_train.shape[1]]))]
    onnx_model = onnxmltools.convert_xgboost(best_model, initial_types=initial_type)
    onnx.save_model(onnx_model, 'artifacts/model.onnx')

    print("Training complete. Model and configurations saved successfully inside /artifacts.")