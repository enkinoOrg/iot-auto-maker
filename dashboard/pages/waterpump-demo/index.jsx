import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import * as mqtt from 'mqtt'; // import everything inside the mqtt module and give it the namespace "mqtt"
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

const data = {
  labels,
  datasets: sensorDatasets,
};

export default function WaterpumpDemo() {
  const [autoMode, setAutoMde] = useState(false); // 자동모드 (시험용)
  const [mqttClientReady, setMqttClientReady] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [isRelay, setIsRelay] = useState(0);
  const [tableData, setTableData] = useState(data);
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
        // 100개의 데이터를 가져와서 각각의 시간대별로 데이터를 저장 (리버스 상태)
        for (let i = 0; i < 100; i++) {
          const createdAt = responseData[i].created_at.substring(11, 19); //시간만 가져오기
          temperatureCounts[createdAt] = responseData[i].temperature;
          humidityCounts[createdAt] = responseData[i].humidity;
          moistureCounts[createdAt] = responseData[i].moisture;
        }

        const labels = Object.keys(humidityCounts);
        const temperatureValues = Object.values(temperatureCounts);
        const humidityValues = Object.values(humidityCounts);
        const moistureValues = Object.values(moistureCounts);

        const newData = {
          ...tableData,
          labels: labels,
          datasets: [
            {
              ...tableData.datasets[0],
              data: temperatureValues,
            },
            {
              ...tableData.datasets[1],
              data: humidityValues,
            },
            {
              ...tableData.datasets[2],
              data: moistureValues,
            },
          ],
        };
        setTableData(newData);
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
        // setConnectStatus('Connected');
        console.error('Connected');
        mqttClient.subscribe('telemetry');
      });

      mqttClient.on('error', (err) => {
        console.error('Connection error: ', err);
        // setConnectStatus('Connection error: ' + err);
        mqttClient.unsubscribe('telemetry');
        mqttClient.end();
      });

      mqttClient.on('reconnect', () => {
        console.log('reconnect');
        // setConnectStatus('Reconnecting');
      });

      mqttClient.on('message', (topic, message) => {
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

  const onClickHandler = async () => {
    const topic = 'cmd/water1-E8DB84986E61';
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
      sendMqttMessage(topic, JSON.stringify(mqttMessage));
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

  return (
    <div className='container'>
      <div>
        <div className='info'>
          {isRelay === 0
            ? '현재 워터펌프 상태 : OFF'
            : '현재 워터펌프 상태 : ON '}
        </div>
        <div className='info'>
          <button onClick={onClickHandler}>
            {isRelay === 0 ? '펌프 켜기 명령 보내기' : '펌프 끄기 명령 보내기'}
          </button>
        </div>
      </div>

      <LineGraph tableData={tableData} />

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
