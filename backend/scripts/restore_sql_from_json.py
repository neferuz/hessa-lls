import json
import sqlite3
import os

db_path = "/Users/apple/Desktop/hessa-lls-main/backend/hessa.lls"
json_path = "/Users/apple/Desktop/hessa-lls-main/backend/content_data.json"

def restore_db():
    if not os.path.exists(json_path):
        print(f"JSON not found: {json_path}")
        return

    with open(json_path, "r") as f:
        data = json.load(f)
    
    products_data = data.get("products", [])
    if not products_data:
        print("No products found in JSON")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get unique categories
    categories = {}
    for p in products_data:
        cat_name = p.get("category", "Uncategorized")
        cat_uz = p.get("category_uz", cat_name)
        cat_en = p.get("category_en", cat_name)
        if cat_name not in categories:
            categories[cat_name] = {"uz": cat_uz, "en": cat_en}

    # Insert Categories
    cat_map = {}
    for name, trans in categories.items():
        cursor.execute("SELECT id FROM categories WHERE name = ?", (name,))
        row = cursor.fetchone()
        if row:
            cat_id = row[0]
        else:
            # Table 'categories' only has: id, name, image, description_short, description
            cursor.execute(
                "INSERT INTO categories (name) VALUES (?)",
                (name,)
            )
            cat_id = cursor.lastrowid
        cat_map[name] = cat_id
        print(f"Category: {name} (ID: {cat_id})")

    # Insert Products
    for p in products_data:
        sku = f"RESO-{p['id']}" # Synthetic SKU
        cursor.execute("SELECT id FROM products WHERE sku = ?", (sku,))
        if cursor.fetchone():
            continue
        
        cat_id = cat_map.get(p.get("category"), 1)
        # Table 'products' schema: 
        # id, category_id, name, sku, stock, description_short, description_full, images (JSON), 
        # size_volume, details, usage, delivery_info, cost_price, customs_percent, tax_percent, sale_price, is_active
        images_json = json.dumps([p.get("image")]) if p.get("image") else json.dumps([])
        
        try:
            price_str = str(p.get("price", "0")).replace(" сум", "").replace(" ", "").replace("\u00a0", "")
            price = float(price_str)
        except:
            price = 0.0

        cursor.execute(
            """INSERT INTO products 
               (name, category_id, sku, images, is_active, stock, cost_price, customs_percent, tax_percent, sale_price) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                p.get("name"), cat_id, sku, images_json, 1, 100, price, 0, 0, price
            )
        )
        print(f"Product: {p.get('name')} added.")

    conn.commit()
    conn.close()
    print("Database restoration complete.")

if __name__ == "__main__":
    restore_db()
