import React, { useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function App() {
  const [baseUrl, setBaseUrl] = useState('');
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRecords([]);
    setLoading(true); 

    try {
      const response = await fetch('https://apimigrationrender.onrender.com/check-urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base_url: baseUrl }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecords(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(records);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'URLs');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'url_status.xlsx');
  };

  const totalItems = records.length;
  const totalNotOk = records.filter(record => record.Status !== 'OK').length;

  return (
    <div className="App">
      <h1>Verificador de URLs</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="Digite a URL da página"
          required
        />
        <button type="submit" disabled={loading}>Verificar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {loading ? (
        <p>Carregando...</p> 
      ) : records.length > 0 ? (
        <>
          <button onClick={downloadExcel}>Baixar Excel</button>
          <div>
            <p>Total de itens: {totalItems}</p>
            <p>Total de itens com status diferente de "OK": {totalNotOk}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.URL}</td>
                  <td>{record.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
}

export default App;
