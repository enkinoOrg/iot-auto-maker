import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LineGraph from '../../components/LineChart';
import {
  fetchTable100Data,
  insertMqttCommandData,
  sendMqttMessage,
} from '../../api/sendmqtt';

const labels = [];
const backgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];
const datasets = ['Temperature', 'Humidity', 'Moisture'].map(
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
  datasets,
};

export default function Home() {
  const [isRelay, setIsRelay] = useState(0);
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchTable100Data();

        const responseData = res.data;

        const humidityCounts = {};
        const temperatureCounts = {};
        const moistureCounts = {};

        for (let i = 0; i < 100; i++) {
          const createdAt = responseData[i].created_at.substring(11, 19);
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
        console.log('home newData:', newData);
        setTableData(newData);
      } catch (error) {
        console.error(error);
      }
    };

    getData();
  }, []);

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
        <button onClick={onClickHandler}>{isRelay === 0 ? 'on' : 'off'}</button>
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

        @media (max-width: 600px) {
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
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
