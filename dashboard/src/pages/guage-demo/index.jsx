import React from "react";

import DustGuage from "../../components/Guage/DustGuage";
import HumidityGuage from "../../components/Guage/HumidityGuage";
import MoistureGuage from "../../components/Guage/MoistureGuage";
import PowerGuage from "../../components/Guage/PowerGuage";
import PressureGuage from "../../components/Guage/PressureGuage";
import TemperatureGuage from "../../components/Guage/TemperatureGuage";
import VoltageGuage from "../../components/Guage/VoltageGuage";

import { GuageContainer, InfoBox, Section, Wrapper } from "./index.style";

export default function WaterpumpDemo() {
  return (
    <Section>
      <Wrapper>
        <GuageContainer>
          <InfoBox>
            <p>온도</p>
            <TemperatureGuage />
          </InfoBox>
          <InfoBox>
            <p>습도</p>
            <HumidityGuage />
          </InfoBox>
          <InfoBox>
            <p>수분</p>
            <MoistureGuage />
          </InfoBox>
          <InfoBox>
            <p>압력</p>
            <PressureGuage />
          </InfoBox>
          <InfoBox>
            <p>미세먼지</p>
            <DustGuage />
          </InfoBox>
          <InfoBox>
            <p>전압</p>
            <VoltageGuage />
          </InfoBox>
          <InfoBox>
            <p>전력</p>
            <PowerGuage />
          </InfoBox>
        </GuageContainer>
      </Wrapper>
    </Section>
  );
}
