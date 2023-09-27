import axios from 'axios';

const mqtt = require('mqtt');
let mqttClient = null; // mqtt client 상태를 저장하는 변수

export const fetchTable100Data = async () => {
  try {
    const res = await axios.get(
      // 'http://192.168.219.103:8000/table/get_num/100/'
      'http://localhost:8000/telemetry/get_num/100/'
    );
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const fetchTableOneData = async () => {
  try {
    // const res = await axios.get('http://192.168.219.103:8000/table/get_num/1/');
    const res = await axios.get('http://localhost:8000/telemetry/get_num/1/');
    return res;
  } catch (error) {
    console.error(error);
  }
};

/**
 * {
  "uuid": "string",
  "client_id": "string",
  "cmd": "string",
  "response": "string"
}
 * @returns 
 */

export const insertMqttCommandData = async (mqttData) => {
  try {
    const res = await axios.post('http://localhost:8000/mqtt/', mqttData);
    console.log(res);

    return res;
  } catch (error) {
    console.error(error);
  }
};

// mqtt 서버로 보내는 코드
export const sendMqttMessage = (topic, mqttMessage) => {
  // mqtt client 없으면 생성 후 바로 publish
  if (mqttClient === null) {
    mqttClient = mqtt.connect('ws://localhost:8080');
    mqttClient.on('connect', () => {
      console.log('connected' + mqttClient.connected);
      mqttClient.publish(topic, mqttMessage);
    });

    mqttClient.on('error', (error) => {
      console.log("Can't connect" + error);
    });
  } else {
    // 클라이언트가 있으면 바로 publish
    mqttClient.publish(topic, mqttMessage);
  }
  console.log(mqttMessage);
};
