import json
import os

DATA_FILE = "content_data.json"

def update_footer():
    if not os.path.exists(DATA_FILE):
        print(f"File {DATA_FILE} not found.")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    if "footer" in data:
        footer = data["footer"]
        
        # Clear specific columns as requested
        footer["col_1_title"] = ""
        footer["col_1_title_uz"] = ""
        footer["col_1_title_en"] = ""
        footer["col_1_links"] = []

        footer["col_2_title"] = ""
        footer["col_2_title_uz"] = ""
        footer["col_2_title_en"] = ""
        footer["col_2_links"] = []

        footer["col_3_title"] = ""
        footer["col_3_title_uz"] = ""
        footer["col_3_title_en"] = ""
        footer["col_3_links"] = []

        # Update legal links with provided URLs and titles
        footer["legal_links"] = [
            {
                "label": "Отказ от ответственности",
                "label_uz": "Mas'uliyatni rad etish",
                "label_en": "Disclaimer",
                "url": "http://127.0.0.1:8000/static/uploads/72184e0a-be43-4818-b591-24b2cb4aea25.docx"
            },
            {
                "label": "Пользовательское соглашение",
                "label_uz": "Foydalanish shartlari",
                "label_en": "User Agreement",
                "url": "http://127.0.0.1:8000/static/uploads/e1e33ee1-83c0-425f-a0a3-ea05ab302874.docx"
            },
            {
                "label": "Политика конфиденциальности",
                "label_uz": "Maxfiylik siyosati",
                "label_en": "Privacy Policy",
                "url": "http://127.0.0.1:8000/static/uploads/d8204e51-0eab-4bb1-9760-4d1c9f835cca.docx"
            },
            {
                "label": "Публичная оферта",
                "label_uz": "Ommaviy oferta",
                "label_en": "Public Offer",
                "url": "http://127.0.0.1:8000/static/uploads/91f34b37-76bb-4115-81c5-89faccd3645d.docx"
            }
        ]
        
        # Update copyright year just in case
        footer["copyright_text"] = "© 2018 — 2024 HESSA Inc."

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print("Footer content updated successfully!")

if __name__ == "__main__":
    update_footer()
