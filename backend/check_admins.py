import sqlite3

def check_admins():
    try:
        conn = sqlite3.connect('hessa.lls')
        cursor = conn.cursor()
        cursor.execute("SELECT username FROM admins")
        admins = cursor.fetchall()
        print(f"Admins: {admins}")
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_admins()
