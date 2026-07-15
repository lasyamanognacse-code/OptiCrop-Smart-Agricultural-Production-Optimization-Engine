from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

def train_baseline():
    X_train = pd.read_csv('train_X.csv')
    y_train = pd.read_csv('train_y.csv').values.ravel()
    X_test = pd.read_csv('test_X.csv')
    y_test = pd.read_csv('test_y.csv').values.ravel()
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"Baseline accuracy: {acc:.4f}")
    return model
