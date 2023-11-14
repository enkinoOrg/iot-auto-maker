import { useEffect, useState } from "react";

import * as mqtt from "mqtt";

import { v4 as uuidv4 } from "uuid";

import {
  fetchTable100Data,
  insertMqttCommandData,
  sendMqttMessage,
} from "src/api/sendmqtt";

import {
  downloadCSV,
  startRecording,
  stopRecording,
} from "src/utils/recordLogUtils";

import LineGraph from "src/components/LineChart";

import {
  CommandBtn,
  CommandContainer,
  LogBox,
  Section,
  StatusBox,
} from "./index.style";

// 데이터 차트 속성
const labels = [];
const backgroundColors = ["#FF6384", "#36A2EB", "#FFCE56"];

// 센서 데이터 차트 속성
const sensorDatasets = ["Temperature", "Humidity", "Moisture"].map(
  (label, index) => ({
    label,
    fill: false,
    lineTension: 0.1,
    backgroundColor: backgroundColors[index],
    borderColor: backgroundColors[index],
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: backgroundColors[index],
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: backgroundColors[index],
    pointHoverBorderColor: backgroundColors[index],
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: [],
  })
);

// 릴레이 데이터 차트 속성
const relayDatasets = ["Water Pump"].map((label, index) => ({
  label,
  fill: false,
  lineTension: 0.1,
  backgroundColor: backgroundColors[index],
  borderColor: backgroundColors[index],
  borderCapStyle: "butt",
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: "miter",
  pointBorderColor: backgroundColors[index],
  pointBackgroundColor: "#fff",
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: backgroundColors[index],
  pointHoverBorderColor: backgroundColors[index],
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  data: [],
}));

const sensorDataInit = {
  labels,
  datasets: sensorDatasets,
};

const relayDataInit = {
  labels,
  datasets: relayDatasets,
};

export default function WaterpumpDemo() {
  const [autoMode, setAutoMde] = useState(false); // 자동모드 (시험용)
  const [mqttClientReady, setMqttClientReady] = useState(false);
  const [jsonData, setJsonData] = useState(null);

  const [isRelay, setIsRelay] = useState(0);
  const [sensorData, setSensorData] = useState(sensorDataInit);
  const [relayData, setRelayData] = useState(relayDataInit);

  const [isRecording, setIsRecording] = useState(false); // 로그 기록용
  const [logArray, setLogArray] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchTable100Data();

        // 데이터 순서 정렬
        const responseData = res.data.sort((a, b) => a.id - b.id);

        const humidityCounts = {};
        const temperatureCounts = {};
        const moistureCounts = {};
        const relayCounts = {};

        // 100개의 데이터를 가져와서 각각의 시간대별로 데이터를 저장 (리버스 상태)
        for (let i = 0; i < 100; i++) {
          const createdAt = responseData[i].created_at.substring(11, 19); // 시간만 가져오기
          temperatureCounts[createdAt] = responseData[i].temperature;
          humidityCounts[createdAt] = responseData[i].humidity;
          moistureCounts[createdAt] = responseData[i].moisture;
          relayCounts[createdAt] = responseData[i].water_pump;
        }

        const labels = Object.keys(humidityCounts);
        const temperatureValues = Object.values(temperatureCounts);
        const humidityValues = Object.values(humidityCounts);
        const moistureValues = Object.values(moistureCounts);
        const relayValues = Object.values(relayCounts);

        const newSensorData = {
          ...sensorData,
          labels: labels,
          datasets: [
            {
              ...sensorData.datasets[0],
              data: temperatureValues,
            },
            {
              ...sensorData.datasets[1],
              data: humidityValues,
            },
            {
              ...sensorData.datasets[2],
              data: moistureValues,
            },
          ],
        };

        setSensorData(newSensorData);

        const newRelayData = {
          ...relayData,
          labels: labels,
          datasets: [
            {
              ...relayData.datasets[0],
              data: relayValues,
            },
          ],
        };

        setRelayData(newRelayData);
      } catch (error) {
        console.error(error);
      }
    };

    // 1초마다 getData() 함수를 실행
    const interval = setInterval(() => {
      getData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // mqtt 통신
  useEffect(() => {
    let mqttClient;

    const setupMqttClient = () => {
      const mqttClient = mqtt.connect("ws://localhost:8080");

      mqttClient.on("connect", () => {
        console.error("Connected");
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
        const commandTopic = "cmd/water1-E8DB84986E61";
        const jsonData = JSON.parse(message);
        setJsonData({
          temperature: jsonData["0"],
          humidity: jsonData["1"],
          moisture: jsonData["2"],
          water_pump: jsonData["3"],
        });

        setIsRelay(jsonData["3"]);

        if (isRecording) {
          setLogArray((prevLogs) => [...prevLogs, jsonData]);
        }

        if (autoMode) {
          if (jsonData[2] >= 100 && jsonData[3] === 0) {
            // 오토모드일 때, 수분센서가 100이상이고 펌프가 꺼져 있으면 펌프를 켠다.
            console.log("jsonData[2]", jsonData[2], "water_pump", jsonData[3]);
            const uuid = uuidv4();
            const mqttMessage = {
              uuid,
              relay_name: "water_pump",
              relay_value: 1,
            };

            const mqttDatabaseData = {
              uuid,
              client_id: "water1-E8DB84986E61",
              cmd: JSON.stringify(mqttMessage),
              response: "",
            };

            insertMqttCommandData(mqttDatabaseData);
            sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
          } else if (jsonData[2] <= 50 && jsonData[3] === 1) {
            // 오토모드일 때, 수분센서가 50이하이고 펌프가 켜져 있으면 펌프를 끈다
            const uuid = uuidv4();
            const mqttMessage = {
              uuid,
              relay_name: "water_pump",
              relay_value: 0,
            };

            const mqttDatabaseData = {
              uuid,
              client_id: "water1-E8DB84986E61",
              cmd: JSON.stringify(mqttMessage),
              response: "",
            };

            insertMqttCommandData(mqttDatabaseData);
            sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
          }
        }
        console.log("Auto Mode:" + autoMode);
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
  }, [mqttClientReady, isRecording, autoMode]);

  const onAutomodeOnOffHandler = () => {
    if (autoMode === false) {
      setAutoMde(true);
    } else {
      setAutoMde(false);
    }
  };

  const onManualOnOffHandler = () => {
    const commandTopic = "cmd/water1-E8DB84986E61";
    if (isRelay === 0) {
      setIsRelay(1);

      const uuid = uuidv4();
      const mqttMessage = {
        uuid,
        relay_name: "water_pump",
        relay_value: 1,
      };

      const mqttDatabaseData = {
        uuid,
        client_id: "water1-E8DB84986E61",
        cmd: JSON.stringify(mqttMessage),
        response: "",
      };

      insertMqttCommandData(mqttDatabaseData);
      sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
    } else {
      setIsRelay(0);

      const uuid = uuidv4();
      const mqttMessage = {
        uuid,
        relay_name: "water_pump",
        relay_value: 0,
      };

      const mqttDatabaseData = {
        uuid,
        client_id: "water1-E8DB84986E61",
        cmd: JSON.stringify(mqttMessage),
        response: "",
      };

      insertMqttCommandData(mqttDatabaseData);
      sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
    }
  };

  return (
    <Section>
      <CommandContainer>
        <div>
          <StatusBox>
            {autoMode === false ? "자동모드 상태 : OFF" : "자동모드 상태 : ON "}
            <CommandBtn onClick={onAutomodeOnOffHandler}>
              {autoMode === false ? "자동 모드 켜기" : "자동 모드 끄기"}
            </CommandBtn>
          </StatusBox>

          <StatusBox style={{ marginTop: "10px" }}>
            {isRelay === 0 ? "워터펌프 상태 : OFF" : "워터펌프 상태 : ON "}
            <CommandBtn onClick={onManualOnOffHandler}>
              {isRelay === 0 ? "워터 펌프 켜기" : "워터 펌프 끄기"}
            </CommandBtn>
          </StatusBox>
        </div>

        <LogBox>
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
        </LogBox>
      </CommandContainer>

      <LineGraph tableData={sensorData} height={350} />
      <LineGraph tableData={relayData} height={350} />
    </Section>
  );
}
