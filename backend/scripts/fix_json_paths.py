import json
import os

files = ["about_data.json", "content_data.json", "hero_data.json", "quiz_data.json"]
backend_dir = "/Users/apple/Desktop/hessa-lls-main/backend"

def fix_paths(data):
    if isinstance(data, dict):
        for k, v in data.items():
            if k == "image" and isinstance(v, str) and not v.startswith("http") and not v.startswith("/static/"):
                clean = v.lstrip("/")
                data[k] = f"/static/{clean}"
            elif isinstance(v, (dict, list)):
                fix_paths(v)
    elif isinstance(data, list):
        for item in data:
            fix_paths(item)

for filename in files:
    path = os.path.join(backend_dir, filename)
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
    
    with open(path, "r") as f:
        try:
            data = json.load(f)
            fix_paths(data)
            with open(path, "w") as fw:
                json.dump(data, fw, indent=4, ensure_ascii=False)
            print(f"Fixed paths in {filename}")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
