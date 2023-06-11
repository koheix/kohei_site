import os
import glob
import sys
import datetime
from PIL import Image
import pyheif

"""
#HEIC to JPG
def conv(image_path):
    new_name = image_path.replace('HEIC', 'JPG')
    heif_file = pyheif.read(image_path)
    data = Image.frombytes(
        heif_file.mode,
        heif_file.size,
        heif_file.data,
        "raw",
        heif_file.mode,
        heif_file.stride,
        )
    data.save(new_name, "JPG")

lst = glob.glob("beforepics/*.HEIC")
for l in lst:
    print(l)
    conv(l)
"""

#写真の年月日の初期化
year = 0
month = 0
day = 0

args = sys.argv

#コマンドライン引数から年月日を取得
year = int(args[1])
month = int(args[2])
day = int(args[3])

#datetime型に直す
start = datetime.datetime(year, month, day)
print(start)

path = "beforepics/*.jpg"
i = 1

#変更前のファイル名リスト取得
first = glob.glob(path)

for file in first:
    #日付ファイル名を生成
    year = str(start.year)
    month = str(start.month).zfill(2)
    day = str(start.day).zfill(2)

    os.rename(file, "beforepics/pic" + year + month + day + ".JPG")
    #print("beforepics/pic" + year + month + day + ".JPG")
    start = start + datetime.timedelta(days=1)

