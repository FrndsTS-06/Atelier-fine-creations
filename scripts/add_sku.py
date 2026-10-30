import sqlite3

con = sqlite3.connect('backend/prisma/dev.db')
cur = con.cursor()
try:
    cur.execute("ALTER TABLE products ADD COLUMN sku TEXT")
    con.commit()
    print("Successfully added sku column to products table!")
except Exception as e:
    print("Error:", e)

columns = cur.execute("PRAGMA table_info(products)").fetchall()
for col in columns:
    print("Col:", col[1], col[2])
con.close()
