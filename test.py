import subprocess
from datetime import date
import os


sp = subprocess.run(["git", "status", "-s"], capture_output=True)
print(sp.stdout.decode("utf-8").strip())
exit

wc = subprocess.check_output(["wc", "-l"], input=sp.stdout)
num = wc.decode("utf-8").strip()
if num == "0":
    print("\nNo changes detected... Done.")
else:
    print("\nEnter GIT commit comment for the " + num + " change(s), or leave blank to skip.")
    txt = input("Comment: ")
    if txt != "":
        #subprocess.run(["git", "add", "."], capture_output=True)
        today = date.today().strftime("%m/%d/%Y")
        #subprocess.run(["git", "commit", "-m", '"' + txt + ": " + today + '"'], capture_output=True)
        #subprocess.run(["git", "push", "origin", "master"], capture_output=True)
        print("Done.")
    else:
        print("Skipped GIT commit.")