import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

const BarcodeScanner = () => {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const videoElement = videoRef.current;

    if (isScanning && videoElement) {
      codeReader.current
        .decodeFromVideoDevice(
          null, // Usar null en lugar de undefined
          videoElement,
          (result: Result | undefined, error?: unknown) => {
            if (result) {
              console.log("Código detectado:", result.getText());
              setScannedCode(result.getText());
              setIsScanning(false);
              codeReader.current.reset(); // Detener el escaneo
            }

            if (error) {
              console.error("Error al escanear:", error);
            }
          }
        )
        .catch((err) => console.error("Error al iniciar el escáner:", err));
    } else {
      codeReader.current.reset(); // Detener el escaneo si isScanning es falso
    }

    return () => {
      codeReader.current.reset(); // Detener el escaneo al desmontar
    };
  }, [isScanning]);

  return (
    <div>
      <h1>Escanear Código de Barras</h1>
      <video ref={videoRef} style={{ width: "100%" }} />
      <button onClick={() => setIsScanning(!isScanning)}>
        {isScanning ? "Detener Escaneo" : "Escanear Código"}
      </button>
      {scannedCode && <p>Código escaneado: {scannedCode}</p>}
    </div>
  );
};

export default BarcodeScanner;