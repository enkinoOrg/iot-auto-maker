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
sec_key = ['angle_x', 'angle_y', 'random', 'counter']


# 데이터 개수가 다르거나, 데이터 가 없을때 0으로 처리


def makeJsonData(json_data, sec_key):
    value = {}

    # 수정해야할 부분
    value["RTU_ID"] = json_data["id"]

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

    url = "http://backend:8000"

    if (msg.topic == "response"):
        json_data = json.loads(msg.payload.decode("utf-8"))
        json_value = {}
        json_value["response"] = json_data["response"]
        response_url = url + "/mqtt/"+json_data["uuid"]+"/response"
        response = requests.put(response_url, json=json_value)

    elif (msg.topic == "telemetry"):
        json_data = json.loads(msg.payload.decode("utf-8"))
        json_value = makeJsonData(json_data, sec_key)

        response = requests.post(url + "/telemetry", json=json_value)
        print("response : ", response)


client = mqtt.Client()
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_subscribe = on_subscribe
client.on_message = on_message

client.connect("mosquitto", 1883)
client.subscribe("telemetry", 1)
client.subscribe("response", 1)
client.loop_forever()

# function
