import sqlite3
import hashlib

def reset_admin_password():
    SECRET_KEY = "your-secret-key-change-in-production-hessa-admin-2024"
    password = "admin"
    hashed_password = hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()
    
    try:
        conn = sqlite3.connect('hessa.lls')
        cursor = conn.cursor()
        
        # Check if admin exists
        cursor.execute("SELECT id FROM admins WHERE username = 'admin'")
        row = cursor.fetchone()
        
        if row:
            cursor.execute("UPDATE admins SET hashed_password = ? WHERE username = 'admin'", (hashed_password,))
            print("Password for 'admin' updated to 'admin'")
        else:
            cursor.execute("INSERT INTO admins (username, hashed_password) VALUES (?, ?)", ('admin', hashed_password))
            print("Admin 'admin' created with password 'admin'")
            
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    reset_admin_password()
