import traceback
import backend.ml_utils

try:
    backend.ml_utils.load_model()
    print("Model loaded successfully")
except Exception as e:
    with open('error.txt', 'w') as f:
        traceback.print_exc(file=f)
