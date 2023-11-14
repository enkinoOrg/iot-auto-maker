import { saveAs } from "file-saver";

export const startRecording = (setIsRecording, setLogArray) => {
  setIsRecording(true);
  setLogArray([]);
};

export const stopRecording = (setIsRecording) => {
  setIsRecording(false);
};

export function objectsToCSV(objects) {
  if (objects.length === 0) {
    return "";
  }

  const header = Object.keys(objects[0]);
  const csvRows = [];

  csvRows.push(header.join(","));

  objects.forEach((object) => {
    const values = header.map((key) => {
      const value = object[key];
      return `"${value}"`;
    });

    csvRows.push(values.join(","));
  });

  const csvString = csvRows.join("\n");

  return csvString;
}

export const downloadCSV = (logArray) => {
  if (logArray.length === 0) {
    alert("다운로드할 데이터가 없습니다.");
    return;
  }

  const csvData = objectsToCSV(logArray);

  const blob = new Blob([csvData], { type: "text/csv" });
  saveAs(blob, "mqtt_data.csv");
};
