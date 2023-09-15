import React, { Suspense, useState, useEffect } from 'react';
import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Canvas } from '@react-three/fiber';
// import './index.css';

function R3FFlight() {
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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <App
            angle_x={jsonData?.angle_x || 0}
            angle_y={jsonData?.angle_y || 0}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default R3FFlight;
