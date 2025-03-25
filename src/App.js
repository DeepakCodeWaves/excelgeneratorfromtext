import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const values = text.split(',');

      const columnA = [];
      const columnB = [];

      for (let i = 0; i < values.length; i++) {
        if (i % 2 === 0) {
          columnA.push([values[i].trim()]);
        } else {
          columnB.push([values[i].trim()]);
        }
      }

      const worksheet = XLSX.utils.aoa_to_sheet([['Column A', 'Column B']]);
      columnA.forEach((val, index) => {
        XLSX.utils.sheet_add_aoa(worksheet, [[val, columnB[index]]], { origin: -1 });
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'output.xlsx');
    };

    reader.readAsText(file);
  };

  return (
    <div className="App">
      <h1>Text to Excel Converter</h1>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file}>
        Upload and Convert
      </button>
    </div>
  );
}

export default App;
