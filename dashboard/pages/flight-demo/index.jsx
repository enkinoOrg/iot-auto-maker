import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LineGraph from '../../components/LineChart';
import {
  fetchTableOneData,
  insertMqttCommandData,
  sendMqttMessage,
} from '../api/sendmqtt';

export default function FlightDemo() {
  const [tableData, setTableData] = useState({});

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchTableOneData();
        setTableData(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    // 0.1초마다 getData() 함수를 실행
    const interval = setInterval(() => {
      getData();
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='container'>
      {/* <LineGraph tableData={tableData} /> */}
      {JSON.stringify(tableData)}

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
