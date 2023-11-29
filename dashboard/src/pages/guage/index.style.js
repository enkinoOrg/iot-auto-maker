import styled from "@emotion/styled";

export const Section = styled.section`
  width: 100%;
  min-height: 100vh;
  padding: 3rem 0;
  font-size: 14px;
  background-color: #222;

  @media (max-width: 1400px) {
    width: 90vw;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60vw;
  margin: 0 auto;
`;

export const GuageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  width: 100%;
  margin-bottom: 30px;
  color: #fff;
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #444;
  border-radius: 10px;
  overflow: hidden;
  background-color: #444;

  > p {
    width: 100%;
    margin: 0;
    padding: 10px;
    font-size: 15px;
    font-weight: 400;
    color: #fff;
  }

  > button {
    padding: 40px;
    border: none;
    color: white;
    background-color: #222;
    outline: none;
    font-size: 12px;
    cursor: pointer;
    :hover {
      opacity: 0.7;
      transition: all 0.5s;
    }

    > span {
      display: block;
      margin-top: 10px;
      font-size: 24px;
    }
  }
`;

export const LogContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #444;
  border-radius: 10px;
  overflow: hidden;
  background-color: #444;
`;

export const ChartContainer = styled.div`
  padding: 20px;
  background-color: #333;
  border-radius: 10px;
  :last-of-type {
    margin-top: 30px;
  }
`;

export const CommandContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 10px;
  background-color: #444;
  color: #fff;

  @media (max-width: 1400px) {
    width: 90%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
    width: 90%;
  }
`;

export const StatusBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const LogBox = styled.div`
  display: flex;
  gap: 5px;
`;

export const CommandBtn = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  color: #fff;
  /* background-color: #27374d; */
  background-color: #666;
  font-size: 13px;
  cursor: pointer;
`;
