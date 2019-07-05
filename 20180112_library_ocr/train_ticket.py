from aip import AipOcr
import base64

""" 你的 APPID AK SK """
APP_ID = '10682639'
API_KEY = 'yYkzlkhdkO4CsOo7fGHZmgXx'
SECRET_KEY = 'DWIxGQsDGbuTY9v7qCC5t5VqOkDZC8c1'

client = AipOcr(APP_ID, API_KEY, SECRET_KEY)


""" 读取图片 """
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()

image = get_file_content('p3.png')

""" 调用火车票识别 """
print(client.trainTicket(image))
