import pickle
import numpy as np
import os

# Define paths to model files
MODEL_DIR = os.path.join(os.path.dirname(__file__), "ml_models")
MODEL_PATH = os.path.join(MODEL_DIR, "svm_model.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")

def load_model():
    """Loads the pre-trained SVM model and scaler."""
    try:
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        with open(SCALER_PATH, "rb") as f:
            scaler = pickle.load(f)
        return model, scaler
    except FileNotFoundError as e:
        print(f"Error loading model: {e}")
        return None, None

def predict_crop(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall):
    """
    Predicts the best crop based on soil and weather parameters.
    """
    model, scaler = load_model()
    if not model or not scaler:
        return None

    # Prepare input data
    input_data = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])
    
    # Scale input data
    scaled_data = scaler.transform(input_data)
    
    # Predict
    prediction = model.predict(scaled_data)
    
    # In a real SVM model, we might get probabilities if enabled
    # For now, we return the crop name and a dummy confidence
    return {
        "crop": prediction[0],
        "confidence": 95.0,  # Placeholder confidence
        "suitable_conditions": f"Optimized for conditions with pH {ph} and rainfall {rainfall} mm.",
        "fertilizer_tips": "Follow standard NPK application guidelines for this crop.",
        "estimated_yield": "Average yield expected for this region."
    }
