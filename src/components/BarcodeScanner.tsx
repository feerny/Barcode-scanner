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
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning && scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment", // Cámara trasera
              width: { ideal: 640 }, // Mejor resolución
              height: { ideal: 480 },
            },
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader", "upc_reader"],
          },
          locate: true, // Activar localización automática
          locator: {
            patchSize: "large", // Aumenta la sensibilidad
            halfSample: false,
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

      Quagga.onProcessed((result: any) => {
        if (result) {
          console.log("Frame analizado:", result);
        }
      });

      const onDetected = (data: { codeResult: { code: string } }) => {
        console.log("Código detectado:", data.codeResult.code);

        setScannedCode(data.codeResult.code);
        setIsScanning(false);

        Quagga.stop();
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
