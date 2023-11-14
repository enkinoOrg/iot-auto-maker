import styled from "@emotion/styled";

export const Section = styled.section`
  min-height: 100vh;
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80vw;
  margin: 0 auto;
  font-size: 14px;

  @media (max-width: 1400px) {
    width: 90vw;
  }
`;

export const CommandContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 10px;

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
  background-color: #27374d;
  font-size: 13px;
  cursor: pointer;
`;
