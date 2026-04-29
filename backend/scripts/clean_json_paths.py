import json
import os

files = ["about_data.json", "content_data.json", "hero_data.json", "quiz_data.json"]
backend_dir = "/Users/apple/Desktop/hessa-lls-main/backend"
PREFIX_TO_REMOVE = "http://127.0.0.1:8000"

def clean_paths(data):
    if isinstance(data, dict):
        for k, v in data.items():
            if (k == "image" or k == "images") and isinstance(v, str):
                if v.startswith(PREFIX_TO_REMOVE):
                    data[k] = v.replace(PREFIX_TO_REMOVE, "")
                # Ensure it starts with /static/ if it's a local path
                if not data[k].startswith("http") and not data[k].startswith("/static/"):
                    clean = data[k].lstrip("/")
                    data[k] = f"/static/{clean}"
            elif isinstance(v, list) and (k == "images" or k == "image"):
                 data[k] = [item.replace(PREFIX_TO_REMOVE, "") if isinstance(item, str) and item.startswith(PREFIX_TO_REMOVE) else item for item in v]
            elif isinstance(v, (dict, list)):
                clean_paths(v)
    elif isinstance(data, list):
        for item in data:
            clean_paths(item)

for filename in files:
    path = os.path.join(backend_dir, filename)
    if not os.path.exists(path):
        continue
    
    with open(path, "r") as f:
        try:
            data = json.load(f)
            clean_paths(data)
            with open(path, "w") as fw:
                json.dump(data, fw, indent=4, ensure_ascii=False)
            print(f"Cleaned paths in {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
