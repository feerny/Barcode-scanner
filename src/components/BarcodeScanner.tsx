import { useRef, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Result } from "@zxing/library";

interface BarcodeScannerProps {
  isScanning: boolean;
  setScannedCode: (code: string) => void;
  setIsScanning: (isScanning: boolean) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isScanning,
  setScannedCode,
  setIsScanning,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const videoElement = videoRef.current;

    if (isScanning && videoElement) {
      codeReader.current
        .decodeFromVideoDevice(undefined, videoElement, (result: Result | undefined, error: unknown) => {
          if (result) {
            console.log("Código detectado:", result.getText());
            setScannedCode(result.getText());
            setIsScanning(false);
            stopScanning(); // Detiene el escaneo cuando se detecta un código
          }

          if (error) {
            console.error("Error al escanear:", error);
          }
        })
        .catch((err) => console.error("Error al iniciar el escáner:", err));
    } else {
      stopScanning(); // Detiene el escaneo si isScanning es falso
    }

    return () => {
      stopScanning(); // Detiene el escaneo cuando se desmonta el componente
    };
  }, [isScanning]);

  const stopScanning = () => {
    // Detiene la transmisión de video
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }} />
    </div>
  );
};

export default BarcodeScanner;