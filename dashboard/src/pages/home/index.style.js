import styled from "@emotion/styled";
import Card from "@mui/material/Card";

export const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: #f3f6f9;
`;

export const DemoCard = styled(Card)`
  width: calc(100% / 2);
  padding: 30px;

  > strong {
    display: block;
    font-size: 24px;

    @media screen and (max-width: 768px) {
      font-size: 16px;
    }
  }

  > a {
    display: block;
    margin-top: 50px;
    text-decoration: none;
    color: #1976d2;

    @media screen and (max-width: 768px) {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 16px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  width: 50vw;

  @media screen and (max-width: 1200px) {
    width: 90vw;
    gap: 20px;
  }
`;
