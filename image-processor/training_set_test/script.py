import os

count= 550
for filename in os.listdir("."):
    if filename == "script.py":
        continue
    print(filename)
    if (count < 10):
        os.rename(filename, 'img046-0000%d.png' % count)
    elif(count >= 10 and count < 100): 
        os.rename(filename, 'img046-000%d.png' % count)
    elif(count >= 100 and count < 1000): 
        os.rename(filename, 'img046-00%d.png' % count)
    elif(count >= 1000 and count < 10000): 
        os.rename(filename, 'img046-0%d.png' % count)

    count = count + 1