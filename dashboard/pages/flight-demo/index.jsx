import { useEffect, useState } from 'react';
import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Airplane from '../../components/Airplane';

export default function FlightDemo() {
  const [mqttClientReady, setMqttClientReady] = useState(false);
  const [mqttClient, setMqttClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState(null);
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    if (mqttClientReady) {
      mqttClient.on('connect', () => {
        setConnectStatus('Connected');
        mqttClient.subscribe('telemetry');
      });
      mqttClient.on('error', (err) => {
        console.error('Connection error: ', err);
        setConnectStatus('Connection error: ' + err);
        mqttClient.unsubscribe('telemetry');
        mqttClient.end();
      });
      mqttClient.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      mqttClient.on('message', (topic, message) => {
        const jsonData = JSON.parse(message);
        console.log('on message', jsonData);
        setJsonData({ angle_x: jsonData['0'], angle_y: jsonData['1'] });
      });
    } else {
      setMqttClientReady(true);
      setMqttClient(mqtt.connect('ws://192.168.219.103:8080'));
    }

    return () => {
      if (mqttClient) {
        mqttClient.unsubscribe('telemetry');
        mqttClient.end();
      }
    };
  }, [mqttClientReady]);

  if (!jsonData) return null;

  return (
    <div>
      <h2>{`${connectStatus} : ${jsonData?.angle_x} , ${jsonData?.angle_y}`}</h2>
      <Airplane
        angle_x={jsonData && jsonData.angle_x}
        angle_y={jsonData && jsonData.angle_y}
      />
    </div>
  );
}
