import os

files = [
    "/Users/notferuz/Desktop/hessa-main/frontend-website/components/Hero.module.css",
    "/Users/notferuz/Desktop/hessa-main/frontend-website/components/HomeAnalysisBlock.module.css",
    "/Users/notferuz/Desktop/hessa-main/frontend-website/components/TelegramBanner.module.css"
]

for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Primary main color
    content = content.replace("#497a9b", "#768FEC")
    content = content.replace("#497A9B", "#768FEC")
    
    # 2. Hover primary color (slightly darker/richer than 768FEC)
    content = content.replace("#3a627c", "#5A72DE")
    
    # 3. Soft accents using B3C6F1 exactly as requested
    content = content.replace("#eef2fb", "#B3C6F1") # subtle background
    content = content.replace("#ebf0f9", "#B3C6F1") # subtle background
    content = content.replace("#eef2ff", "#B3C6F1")
    content = content.replace("#f0f6ff", "#B3C6F1")
    
    # 4. Update RGB shadows to match the new 768FEC color (118, 143, 236)
    content = content.replace("rgba(73, 122, 155,", "rgba(118, 143, 236,")
    
    with open(f, 'w') as file:
        file.write(content)

print("Colors updated successfully")
