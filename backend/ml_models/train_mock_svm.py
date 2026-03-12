import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Create dummy data for testing the crop recommendation API
# Features: N, P, K, pH, temperature, humidity, rainfall
def generate_mock_data():
    np.random.seed(42)
    n_samples = 400
    
    # We will generate synthetic data for 4 crops: Wheat, Rice, Cotton, Maize
    crops = ['Wheat', 'Rice', 'Cotton', 'Maize']
    
    data = []
    labels = []
    
    for i in range(n_samples):
        crop = np.random.choice(crops)
        if crop == 'Wheat':
            N = np.random.uniform(20, 40)
            P = np.random.uniform(40, 60)
            K = np.random.uniform(15, 25)
            ph = np.random.uniform(6.0, 7.5)
            temp = np.random.uniform(15, 25)
            hum = np.random.uniform(40, 60)
            rain = np.random.uniform(50, 100)
        elif crop == 'Rice':
            N = np.random.uniform(60, 100)
            P = np.random.uniform(35, 60)
            K = np.random.uniform(35, 45)
            ph = np.random.uniform(5.5, 7.0)
            temp = np.random.uniform(20, 35)
            hum = np.random.uniform(80, 95)
            rain = np.random.uniform(200, 300)
        elif crop == 'Cotton':
            N = np.random.uniform(100, 140)
            P = np.random.uniform(30, 60)
            K = np.random.uniform(15, 25)
            ph = np.random.uniform(5.8, 8.0)
            temp = np.random.uniform(22, 35)
            hum = np.random.uniform(60, 80)
            rain = np.random.uniform(60, 110)
        else: # Maize
            N = np.random.uniform(60, 100)
            P = np.random.uniform(35, 60)
            K = np.random.uniform(15, 25)
            ph = np.random.uniform(5.5, 7.5)
            temp = np.random.uniform(18, 27)
            hum = np.random.uniform(50, 70)
            rain = np.random.uniform(60, 100)
            
        data.append([N, P, K, ph, temp, hum, rain])
        labels.append(crop)
        
    return np.array(data), np.array(labels)

def train_and_save():
    print("Generating mock dataset...")
    X, y = generate_mock_data()
    
    print("Scaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    print("Training SVM Model...")
    # enable probability=True to get prediction confidence scores
    model = SVC(kernel='rbf', probability=True, random_state=42)
    model.fit(X_scaled, y)
    
    # Save the model and scaler
    model_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(model_dir, 'svm_model.pkl')
    scaler_path = os.path.join(model_dir, 'scaler.pkl')
    
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"Model saved to {model_path}")
    print(f"Scaler saved to {scaler_path}")
    print("Training Complete ✅")

if __name__ == '__main__':
    train_and_save()
