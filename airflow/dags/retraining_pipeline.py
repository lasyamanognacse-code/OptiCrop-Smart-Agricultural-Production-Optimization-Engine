from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

default_args = {
    'owner': 'mlops',
    'depends_on_past': False,
    'start_date': datetime(2026, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'retraining_pipeline',
    default_args=default_args,
    description='Weekly model retraining',
    schedule_interval='@weekly',
    catchup=False
)

def extract_feedback():
    print("Extracting feedback...")

def merge_data():
    print("Merging data...")

def retrain_model():
    import subprocess
    subprocess.run(['python', '/opt/ml_pipeline/models/xgboost_train.py'], check=True)

def evaluate_model():
    print("Evaluating...")

def promote_model():
    print("Promoting...")

with dag:
    t1 = PythonOperator(task_id='extract_feedback', python_callable=extract_feedback)
    t2 = PythonOperator(task_id='merge_data', python_callable=merge_data)
    t3 = PythonOperator(task_id='retrain_model', python_callable=retrain_model)
    t4 = PythonOperator(task_id='evaluate_model', python_callable=evaluate_model)
    t5 = PythonOperator(task_id='promote_model', python_callable=promote_model)
    t1 >> t2 >> t3 >> t4 >> t5
