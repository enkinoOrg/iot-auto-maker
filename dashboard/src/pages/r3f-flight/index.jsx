import React, { useState, useEffect } from "react";

import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

import * as mqtt from "mqtt";

import {
  downloadCSV,
  startRecording,
  stopRecording,
} from "src/utils/recordLogUtils";

import App from "src/components/FlightApp.jsx";

import { CommandBtn, LocationBox, Section } from "./index.style";

function R3FFlight() {
  const [mqttClientReady, setMqttClientReady] = useState(false);
  const [jsonData, setJsonData] = useState(null);

  const [isRecording, setIsRecording] = useState(false); // 로그 기록
  const [logArray, setLogArray] = useState([]);

  useEffect(() => {
    let mqttClient;

    const setupMqttClient = () => {
      mqttClient = mqtt.connect("ws://localhost:8080");

      mqttClient.on("connect", () => {
        mqttClient.subscribe("telemetry");
      });

      mqttClient.on("error", (err) => {
        console.error("Connection error: ", err);
        mqttClient.unsubscribe("telemetry");
        mqttClient.end();
      });

      mqttClient.on("reconnect", () => {
        console.log("reconnect");
      });

      mqttClient.on("message", (topic, message) => {
        const jsonData = JSON.parse(message);

        setJsonData({ angle_x: jsonData["0"], angle_y: jsonData["1"] });
        if (isRecording) {
          setLogArray((prevLogs) => [...prevLogs, jsonData]);
        }
      });
    };

    if (mqttClientReady) {
      setupMqttClient();
    } else {
      // mqttClient를 생성하기 위해 상태값 변경
      setMqttClientReady(true);
    }

    return () => {
      if (mqttClient) {
        mqttClient.unsubscribe("telemetry");
        mqttClient.end();
      }
    };
  }, [mqttClientReady, isRecording]);

  const calculatePosition = () => {
    return [10, 10, 0];
  };

  return (
    <Section>
      <Canvas shadows>
        <Html
          prepend
          calculatePosition={calculatePosition}
          style={{
            display: "flex",
            width: "270px",
            gap: "10px",
            flexDirection: "column",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "white",
            opacity: "0.8",
          }}
        >
          <LocationBox>
            <span>angle_x: {jsonData?.angle_x}</span>
            <span>angle_y: {jsonData?.angle_y}</span>
          </LocationBox>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexDirection: "row",
            }}
          >
            <CommandBtn
              onClick={() => startRecording(setIsRecording, setLogArray)}
              disabled={isRecording}
            >
              로그 시작
            </CommandBtn>
            <CommandBtn
              onClick={() => stopRecording(setIsRecording)}
              disabled={!isRecording}
            >
              로그 중지
            </CommandBtn>
            <CommandBtn
              onClick={() => downloadCSV(logArray)}
              disabled={logArray.length === 0 && !isRecording}
            >
              로그 다운로드
            </CommandBtn>
          </div>
        </Html>

        <App
          angle_x={jsonData?.angle_x || 0}
          angle_y={jsonData?.angle_y || 0}
        />
      </Canvas>
    </Section>
  );
}

export default R3FFlight;
