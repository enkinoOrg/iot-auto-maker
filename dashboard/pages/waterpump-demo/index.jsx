import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
import { saveAs } from 'file-saver';
import LineGraph from '../../components/LineChart';
import {
  fetchTable100Data,
  insertMqttCommandData,
  sendMqttMessage,
} from '../api/sendmqtt';

const labels = [];
const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];
const sensorDatasets = ['Temperature', 'Humidity', 'Moisture'].map(
  (label, index) => ({
    label,
    fill: false,
    lineTension: 0.1,
    backgroundColor: backgroundColors[index],
    borderColor: backgroundColors[index],
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: backgroundColors[index],
    pointBackgroundColor: '#fff',
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

const relayDatasets = ['Water Pump'].map((label, index) => ({
  label,
  fill: false,
  lineTension: 0.1,
  backgroundColor: backgroundColors[index],
  borderColor: backgroundColors[index],
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: backgroundColors[index],
  pointBackgroundColor: '#fff',
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
        const responseData = res.data.sort((a, b) => a.id - b.id); // 데이터 순서 정렬
        const humidityCounts = {};
        const temperatureCounts = {};
        const moistureCounts = {};
        const relayCounts = {};
        // 100개의 데이터를 가져와서 각각의 시간대별로 데이터를 저장 (리버스 상태)
        for (let i = 0; i < 100; i++) {
          const createdAt = responseData[i].created_at.substring(11, 19); //시간만 가져오기
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

    // getData();

    // 1초마다 getData() 함수를 실행
    const interval = setInterval(() => {
      getData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mqttClient;

    const setupMqttClient = () => {
      mqttClient = mqtt.connect('ws://localhost:8080');

      mqttClient.on('connect', () => {
        console.error('Connected');
        mqttClient.subscribe('telemetry');
      });

      mqttClient.on('error', (err) => {
        console.error('Connection error: ', err);
        mqttClient.unsubscribe('telemetry');
        mqttClient.end();
      });

      mqttClient.on('reconnect', () => {
        console.log('reconnect');
      });

      mqttClient.on('message', (topic, message) => {
        const commandTopic = 'cmd/water1-E8DB84986E61';
        const jsonData = JSON.parse(message);
        setJsonData({
          temperature: jsonData['0'],
          humidity: jsonData['1'],
          moisture: jsonData['2'],
          water_pump: jsonData['3'],
        });
        if (isRecording) {
          setLogArray((prevLogs) => [...prevLogs, jsonData]);
        }
        if (autoMode) {
          if (jsonData[2] >= 40 && jsonData[3] === 0) {
            // 오토모드일 때, 수분센서가 100이상이고 펌프가 꺼져 있으면 펌프를 켠다.
            console.log('jsonData[2]', jsonData[2], 'water_pump', jsonData[3]);
            const uuid = uuidv4();
            const mqttMessage = {
              uuid,
              relay_name: 'water_pump',
              relay_value: 1,
            };

            const mqttDatabaseData = {
              uuid,
              client_id: 'water1-E8DB84986E61',
              cmd: JSON.stringify(mqttMessage),
              response: '',
            };
            insertMqttCommandData(mqttDatabaseData);
            sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
          } else if (jsonData[2] <= 10 && jsonData[3] === 1) {
            // 오토모드일 때, 수분센서가 50이하이고 펌프가 켜져 있으면 펌프를 끈다
            console.log('jsonData[2]', jsonData[2], 'water_pump', jsonData[3]);
            const uuid = uuidv4();
            const mqttMessage = {
              uuid,
              relay_name: 'water_pump',
              relay_value: 0,
            };

            const mqttDatabaseData = {
              uuid,
              client_id: 'water1-E8DB84986E61',
              cmd: JSON.stringify(mqttMessage),
              response: '',
            };
            insertMqttCommandData(mqttDatabaseData);
            sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
          }
        }
        console.log('Auto Mode:' + autoMode);
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
  }, [mqttClientReady, isRecording, autoMode]);

  const onAutomodeOnOffHandler = () => {
    if (autoMode === false) {
      setAutoMde(true);
    } else {
      setAutoMde(false);
    }
  };

  const onManualOnOffHandler = () => {
    const commandTopic = 'cmd/water1-E8DB84986E61';
    if (isRelay === 0) {
      setIsRelay(1);
      const uuid = uuidv4();
      const mqttMessage = {
        uuid,
        relay_name: 'water_pump',
        relay_value: 1,
      };

      const mqttDatabaseData = {
        uuid,
        client_id: 'water1-E8DB84986E61',
        cmd: JSON.stringify(mqttMessage),
        response: '',
      };
      insertMqttCommandData(mqttDatabaseData);
      sendMqttMessage(commandTopic, JSON.stringify(mqttMessage));
    } else {
      setIsRelay(0);
      const uuid = uuidv4();
      const mqttMessage = {
        uuid,
        relay_name: 'water_pump',
        relay_value: 0,
      };

      const mqttDatabaseData = {
        uuid,
        client_id: 'water1-E8DB84986E61',
        cmd: JSON.stringify(mqttMessage),
        response: '',
      };
      insertMqttCommandData(mqttDatabaseData);
      sendMqttMessage(topic, JSON.stringify(mqttMessage));
    }
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
    saveAs(blob, 'waterpump_data.csv');
  };

  return (
    <div className='container'>
      <div className='command_container'>
        <div style={{ padding: 2 }}>
          <button
            onClick={startRecording}
            disabled={isRecording}
            style={{ padding: 2, marginLeft: 4 }}
          >
            로그 시작
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            style={{ padding: 2, marginLeft: 4 }}
          >
            로그 중지
          </button>
          <button
            onClick={downloadCSV}
            disabled={logArray.length === 0 && !isRecording}
            style={{ padding: 2, marginLeft: 4 }}
          >
            로그 다운로드
          </button>
        </div>
        <div>
          <div className='info'>
            {autoMode === false
              ? '현재 자동모드 상태 : OFF'
              : '현재 자동모드 상태 : ON '}
            <button onClick={onAutomodeOnOffHandler}>
              {autoMode === false ? '자동 모드 켜기' : '자동 모드 끄기'}
            </button>
          </div>
        </div>
        <div>
          <div className='info'>
            {isRelay === 0
              ? '현재 워터펌프 상태 : OFF'
              : '현재 워터펌프 상태 : ON '}
            <button onClick={onManualOnOffHandler}>
              {isRelay === 0
                ? '펌프 켜기 명령 수동으로 보내기'
                : '펌프 끄기 명령 수동으로 보내기'}
            </button>
          </div>
        </div>
      </div>
      <LineGraph tableData={sensorData} height={400} />
      <LineGraph tableData={relayData} height={200} />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .info {
          min-height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .command_container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: minmax(400, auto);
        }

        @media (max-width: 900px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

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
