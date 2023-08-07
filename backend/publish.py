import paho.mqtt.client as mqtt
import json

json_data = {
    "RTU_ID": "AF_0001",
    0: 10,
    1: 20,
}


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to broker")
    else:
        print("Bad connection Returned code=", rc)


def on_disconnect(client, userdata, flags, rc=0):
    print(str(rc))


def on_publish(client, userdata, mid):
    print("In on_pub callback mid= ", mid)


client = mqtt.Client()
client.on_connect = on_connect
client.on_disconnect = on_disconnect
client.on_publish = on_publish

client.connect("localhost", 1883)
client.loop_start()

client.publish("device_id/telemetry",
               json.dumps(json_data), 1)
client.loop_stop()
client.disconnect()
