import pickle
import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
import os

MODEL_DIR = "backend/ml_models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Generate dummy training data for 4 crops with 7 features (N, P, K, temp, humidity, ph, rainfall)
X = np.random.rand(100, 7) * 100
y = np.random.choice(["Wheat", "Rice", "Cotton", "Maize"], 100)

# Train a dummy scaler and SVM model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = SVC(probability=True)
model.fit(X_scaled, y)

# Save the mock models
with open(f"{MODEL_DIR}/svm_model.pkl", "wb") as f:
    pickle.dump(model, f)
    
with open(f"{MODEL_DIR}/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
    
print("Mock models safely created and saved to backend/ml_models/.")
