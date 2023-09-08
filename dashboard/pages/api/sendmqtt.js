import axios from 'axios'

const mqtt = require('mqtt')

export const fetchTable100Data = async () => {
  try {
    const res = await axios.get('http://192.168.219.103:8000/table/get_num/100/')
    return res
  } catch (error) {
    console.error(error)
  }
}

/**
 * {
  "uuid": "string",
  "client_id": "string",
  "cmd": "string",
  "response": "string"
}
 * @returns 
 */

export const insertMqttCommandData = async mqttData => {
  try {
    const res = await axios.post('http://192.168.219.103:8000/mqtt/', mqttData)
    console.log(res)

    return res
  } catch (error) {
    console.error(error)
  }
}

const options = {
  host: '192.168.219.103',
  port: 1883,
  protocol: 'mqtt'
  // username:"",
  // password:"",
}

// mqtt 서버로 보내는 코드
export const sendMqttMessage = (topic, mqttMessage) => {
  const client = mqtt.connect(options)

  client.on('connect', () => {
    console.log('connected' + client.connected)
    client.publish(topic, mqttMessage)
    client.end()
  })
}
