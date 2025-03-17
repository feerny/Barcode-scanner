import React, { useState } from "react";
import BarcodeScanner from './components/BarcodeScanner';

const App: React.FC = () => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string>("");

  return (
    <div>
      <h1>Escáner de Código de Barras</h1>
      <button onClick={() => setIsScanning(!isScanning)}>
        {isScanning ? "Detener Escaneo" : "Iniciar Escaneo"}
      </button>

      <BarcodeScanner
        isScanning={isScanning}
        setScannedCode={setScannedCode}
        setIsScanning={setIsScanning}
      />

      {scannedCode && <p>Código Escaneado: {scannedCode}</p>}
    </div>
  );
};

export default App;
