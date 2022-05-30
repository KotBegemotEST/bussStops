
import os
import site
import pip
import time
import mysql.connector;
# 3306


db_handle =  mysql.connector.connect(
    host = 'localhost',
    user = 'root',
    passwd = '123456'
)

kursor = db_handle.cursor();

names = []
os.chdir(r'D:\OneDrive\Desktop\stop-schedule\schedule\gtfs')
file = open("test.txt","r")
for x in file.readlines():
    names.append(x)

for y in names:
    kursor.execute("CREATE DATABASE " + y)
    time.sleep(1)