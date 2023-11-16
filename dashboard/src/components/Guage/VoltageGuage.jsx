import React from "react";

import dynamic from "next/dynamic";

export default function VoltageGuage() {
  const VoltageGuage = dynamic(() => import("react-gauge-component"), {
    ssr: false,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#222",
      }}
    >
      <VoltageGuage
        type="semicircle"
        arc={{
          colorArray: ["#00FF15", "#FF2121"],
          padding: 0.02,
          subArcs: [
            { limit: 20 },
            { limit: 40 },
            { limit: 60 },
            {},
            {},
            {},
            {},
          ],
        }}
        pointer={{
          color: "#345243",
          length: 0.8,
          width: 15,
          elastic: true,
        }}
        labels={{
          valueLabel: {
            formatTextValue: (value) => value + "V",
            style: { color: "black" },
          },
          tickLabels: {
            type: "outer",
            valueConfig: {
              formatTextValue: (value) => value + "V",
            },
          },
        }}
        value={25}
      />
    </div>
  );
}
