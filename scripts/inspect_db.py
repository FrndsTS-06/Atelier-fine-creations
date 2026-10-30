import sqlite3

con = sqlite3.connect('backend/prisma/dev.db')
cur = con.cursor()
for row in cur.execute("SELECT type, name, tbl_name, sql FROM sqlite_master"):
    print(row[0], row[1], "on", row[2])
