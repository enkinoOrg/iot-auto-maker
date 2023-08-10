import paho.mqtt.client as mqtt
import json
import requests


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to broker")
    else:
        print("Bad connection Returned code=", rc)


def on_disconnect(client, userdata, flags, rc=0):
    print(str(rc))


def on_subscribe(client, userdata, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))


# #######################

# sec_key = [
#     "RPM",
# ]

# TODO : 수정해야할 부분
sec_key = ${sec_key}


# 데이터 개수가 다르거나, 데이터 가 없을때 0으로 처리


def makeJsonData(json_data, sec_key):
    value = {}

    # 수정해야할 부분
    value["${table_id}"] = json_data["RTU_ID"]

    try:
        for idx in range(len(sec_key)):
            if json_data[str(idx)] == None:
                value[sec_key[idx]] = 0
            else:
                value[sec_key[idx]] = json_data[str(idx)]
        return value
    except:
        message = "data is not match"
        return message


def on_message(client, userdata, msg):
    json_data = json.loads(msg.payload.decode("utf-8"))
    json_value = makeJsonData(json_data, sec_key)

    # Post temp data from backend:8000
    url = "http://backend:8000/${tablt_name}"


    response = requests.post(url, json=json_value)
    print("response: ", response)

    # get data to backend:8000
    # url = "http://backend:8000"
    # response = requests.get(url)
    # print("response: ", response)

    # post call to backend:8000

    # api call
    # fast api

    print(json_value)
    # print(str(msg.payload.decode("utf-8")))


client = mqtt.Client()
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_subscribe = on_subscribe
client.on_message = on_message

client.connect("mosquitto", 1883)
client.subscribe("device_id/telemetry", 1)
client.loop_forever()

# function
