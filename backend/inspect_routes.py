import sys
import os

# Add backend to path
sys.path.append(os.path.abspath('.'))

from app.main import app

for route in app.routes:
    if hasattr(route, 'path'):
        print(f"{route.path} {getattr(route, 'methods', 'NA')}")
    elif hasattr(route, 'routes'):
        for sub_route in route.routes:
            print(f"  {sub_route.path} {getattr(sub_route, 'methods', 'NA')}")
