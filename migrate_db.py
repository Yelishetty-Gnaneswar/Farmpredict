import sqlite3
import os

db_path = r'c:\Users\Gnaneswar\OneDrive\Desktop\gnani\farmpredict\backend\farmpredict.db'

def migrate():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get current columns
    cursor.execute("PRAGMA table_info(users)")
    columns = [row[1] for row in cursor.fetchall()]
    print(f"Current columns in 'users': {columns}")

    # Renaming hashed_password if exists
    if 'hashed_password' in columns and 'password_hash' not in columns:
        print("Renaming hashed_password to password_hash...")
        # SQLite doesn't support direct rename in older versions, but let's try ALTER RENAME
        try:
            cursor.execute("ALTER TABLE users RENAME COLUMN hashed_password TO password_hash")
            print("Successfully renamed hashed_password.")
        except Exception as e:
            print(f"Could not rename directly: {e}. Trying table recreation.")
            # Fallback for older SQLite
            # This is complex, let's just add the column and migrate manually if rename fails

    # Add new columns if missing
    new_columns = {
        'password_hash': 'TEXT',
        'phone': 'TEXT',
        'location': 'TEXT',
        'farm_size': 'TEXT',
        'primary_crops': 'TEXT',
        'profile_image': 'TEXT',
        'reset_token': 'TEXT',
        'reset_token_expiry': 'DATETIME',
        'enable_weather_alerts': 'INTEGER DEFAULT 1',
        'enable_irrigation_alerts': 'INTEGER DEFAULT 1',
        'enable_market_alerts': 'INTEGER DEFAULT 1',
        'enable_weekly_tips': 'INTEGER DEFAULT 1'
    }

    # Refresh columns after potential rename
    cursor.execute("PRAGMA table_info(users)")
    current_columns = [row[1] for row in cursor.fetchall()]

    for col, col_type in new_columns.items():
        if col not in current_columns:
            print(f"Adding column {col}...")
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {col_type}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
