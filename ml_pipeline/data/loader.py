import os
import pandas as pd
from sklearn.model_selection import train_test_split

def load_and_clean():
    # Fix 1: Dynamically look for the file in the same directory as loader.py
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "crop_recommendation.csv")
    df = pd.read_csv(file_path)
    
    # Fix 2: Calculate median only on numeric columns to avoid string crashes
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Cap outliers using IQR
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df[col] = df[col].clip(lower, upper)
        
    return df

def save_splits(df):
    X = df.drop('label', axis=1)
    y = df['label']
    
    # Split into 70% Train, 15% Validation, 15% Test
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
    
    # Save files relative to the script location
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    X_train.to_csv(os.path.join(current_dir, 'train_X.csv'), index=False)
    y_train.to_csv(os.path.join(current_dir, 'train_y.csv'), index=False)
    X_val.to_csv(os.path.join(current_dir, 'val_X.csv'), index=False)
    y_val.to_csv(os.path.join(current_dir, 'val_y.csv'), index=False)
    X_test.to_csv(os.path.join(current_dir, 'test_X.csv'), index=False)
    y_test.to_csv(os.path.join(current_dir, 'test_y.csv'), index=False)
import os
import pandas as pd
from sklearn.model_selection import train_test_split

def load_and_clean():
    # Fix 1: Dynamically look for the file in the same directory as loader.py
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "crop_recommendation.csv")
    df = pd.read_csv(file_path)
    
    # Fix 2: Calculate median only on numeric columns to avoid string crashes
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # Cap outliers using IQR
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        df[col] = df[col].clip(lower, upper)
        
    return df

def save_splits(df):
    X = df.drop('label', axis=1)
    y = df['label']
    
    # Split into 70% Train, 15% Validation, 15% Test
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
    
    # Save files relative to the script location
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    X_train.to_csv(os.path.join(current_dir, 'train_X.csv'), index=False)
    y_train.to_csv(os.path.join(current_dir, 'train_y.csv'), index=False)
    X_val.to_csv(os.path.join(current_dir, 'val_X.csv'), index=False)
    y_val.to_csv(os.path.join(current_dir, 'val_y.csv'), index=False)
    X_test.to_csv(os.path.join(current_dir, 'test_X.csv'), index=False)
    y_test.to_csv(os.path.join(current_dir, 'test_y.csv'), index=False)