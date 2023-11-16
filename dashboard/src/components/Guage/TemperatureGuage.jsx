import React from "react";

import dynamic from "next/dynamic";

export default function TemperatureGuage() {
  const TempGaugeComponent = dynamic(() => import("react-gauge-component"), {
    ssr: false,
  });

  return (
    <div style={{ height: "100%", backgroundColor: "#222" }}>
      <TempGaugeComponent
        type="semicircle"
        arc={{
          colorArray: ["#00FF15", "#FF2121"],
          padding: 0.02,
          subArcs: [{ limit: 30 }, { limit: 50 }, {}, {}, {}],
        }}
        pointer={{ type: "blob", animationDelay: 0 }}
        labels={{
          valueLabel: { formatTextValue: (value) => value + "ºC" },
          tickLabels: {
            type: "outer",
            valueConfig: {
              formatTextValue: (value) => value + "ºC",
            },
          },
        }}
        value={22.5}
      />
    </div>
  );
}
