import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className='container'>
      <div className='info'>
        <h1>
          <Link href={'waterpump-demo'}>{`워터 펌프 데모`}</Link>
        </h1>
      </div>

      <div className='info'>
        <h1>
          <Link href={'r3f-flight'}>{`자이로 비행기 데모`}</Link>
        </h1>
      </div>
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
};

export default Home;
