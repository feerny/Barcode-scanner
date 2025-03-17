import { useEffect, useRef } from "react";
const Quagga = require("quagga");

interface BarcodeScannerProps {
  isScanning: boolean;
  setScannedCode: (code: string) => void;
  setIsScanning: (value: boolean) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isScanning,
  setScannedCode,
  setIsScanning,
}) => {
  const scannerRef = useRef<HTMLDivElement>(null); // Referencia para el div donde se renderiza la cámara

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current, // Asegurar que Quagga use este div
            constraints: {
              facingMode: "environment", // Cámara trasera
            },
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader", "upc_reader"],
          },
        },
        (err: Error | null) => {
          if (err) {
            console.error("Error al iniciar Quagga:", err);
            return;
          }
          Quagga.start();
        }
      );

      const onDetected = (data: { codeResult: { code: string } }) => {
        console.log("Código detectado:", data.codeResult.code);

        setScannedCode(data.codeResult.code);
        setIsScanning(false);
        
        if (Quagga) {
          Quagga.stop();
        }
      };

      Quagga.onDetected(onDetected);

      return () => {
        Quagga.offDetected(onDetected);
        Quagga.stop();
      };
    }
  }, [isScanning, setScannedCode, setIsScanning]);

  return <div ref={scannerRef} style={{ width: "100%", height: "400px" }} />;
};

export default BarcodeScanner;
