import React from "react";

import Link from "next/link";

import { Container, DemoCard, Section } from "./index.style";

export default function Home() {
  return (
    <Section>
      <Container>
        <DemoCard variant="outlined">
          <strong>워터 펌프 데모</strong>
          <Link href={"waterpump-demo"}>DEMO</Link>
        </DemoCard>

        <DemoCard variant="outlined">
          <strong>자이로 비행기 데모</strong>
          <Link href={"r3f-flight"}>DEMO</Link>
        </DemoCard>
      </Container>
    </Section>
  );
}
