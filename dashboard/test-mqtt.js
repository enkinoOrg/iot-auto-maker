const mqtt = require('mqtt');

const options = {
  host: '192.168.219.103',
  port: 8080,
  protocol: 'ws',
  // username:"",
  // password:"",
};

// mqtt 서버로 보내는 코드
const topic = 'cmd/water1-E8DB84986E61';
const mqttMessage = '';
const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('connected' + client.connected);
  client.publish(topic, mqttMessage);
  client.end();
});
