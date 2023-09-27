import React, { Suspense, useState, useEffect, useRef } from 'react';
import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
import { saveAs } from 'file-saver';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';

import App from '../../components/FlightApp.jsx';

// import './index.css';

function R3FFlight() {
  const [mqttClientReady, setMqttClientReady] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [isRecording, setIsRecording] = useState(false); // 로그 기록
  const [logArray, setLogArray] = useState([]);

  useEffect(() => {
    let mqttClient;

    const setupMqttClient = () => {
      mqttClient = mqtt.connect('ws://localhost:8080');

      mqttClient.on('connect', () => {
        // setConnectStatus('Connected');
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
        setJsonData({ angle_x: jsonData['0'], angle_y: jsonData['1'] });
        if (isRecording) {
          setLogArray((prevLogs) => [...prevLogs, jsonData]);
        }
      });
    };

    if (mqttClientReady) {
      setupMqttClient();
    } else {
      setMqttClientReady(true); // mqttClient를 생성하기 위해, 상태값 변경
    }

    return () => {
      if (mqttClient) {
        mqttClient.unsubscribe('telemetry');
        mqttClient.end();
      }
    };
  }, [mqttClientReady, isRecording]);

  const calculatePosition = () => {
    return [10, 10, 0];
  };

  const startRecording = () => {
    setIsRecording(true);
    setLogArray([]);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  function objectsToCSV(objects) {
    if (objects.length === 0) {
      return '';
    }

    const header = Object.keys(objects[0]);
    const csvRows = [];

    csvRows.push(header.join(','));

    objects.forEach((object) => {
      const values = header.map((key) => {
        const value = object[key];
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    return csvString;
  }

  const downloadCSV = () => {
    if (logArray.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    const csvData = objectsToCSV(logArray);

    const blob = new Blob([csvData], { type: 'text/csv' });
    saveAs(blob, 'mqtt_data.csv');
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Html
          prepend
          calculatePosition={calculatePosition}
          style={{
            display: 'flex',
            width: '265px',
            gap: '10px',
            flexDirection: 'column',
            padding: '10px',
            backgroundColor: 'white',
            opacity: '0.8',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '15px',
              flexDirection: 'row',
            }}
          >
            <span>angle_x: {jsonData?.angle_x}</span>
            <span>angle_y: {jsonData?.angle_y}</span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              flexDirection: 'row',
            }}
          >
            <button onClick={startRecording} disabled={isRecording}>
              로그 시작
            </button>
            <button onClick={stopRecording} disabled={!isRecording}>
              로그 중지
            </button>
            <button
              onClick={downloadCSV}
              disabled={logArray.length === 0 && !isRecording}
            >
              로그 다운로드
            </button>
          </div>
        </Html>

        <App
          angle_x={jsonData?.angle_x || 0}
          angle_y={jsonData?.angle_y || 0}
        />
      </Canvas>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export default R3FFlight;
