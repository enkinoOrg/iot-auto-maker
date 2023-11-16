import React from "react";

import dynamic from "next/dynamic";

export default function MoistureGuage() {
  const MoistureGaugeComponent = dynamic(
    () => import("react-gauge-component"),
    {
      ssr: false,
    }
  );

  return (
    <div
      style={{ height: "100%", backgroundColor: "#222", padding: "10px 5px" }}
    >
      <MoistureGaugeComponent
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
        pointer={{ type: "blob", animationDelay: 0 }}
        labels={{
          valueLabel: { formatTextValue: (value) => value + "%" },
          tickLabels: {
            type: "outer",
            valueConfig: {
              formatTextValue: (value) => value + "%",
            },
          },
        }}
        value={85}
      />
    </div>
  );
}
