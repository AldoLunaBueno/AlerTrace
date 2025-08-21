import { useState, useCallback } from "react";

export type RoyaRisk = "Bajo" | "Medio" | "Alto";
export type RoyaStatus = "Sin plaga detectada" | "Posible presencia de roya";

export interface RoyaDetection {
  status: RoyaStatus;
  risk: RoyaRisk;
  lastScan: Date | null;
  confidence: number;
}

export function useRoyaDetection() {
  const [detection, setDetection] = useState<RoyaDetection>({
    status: "Sin plaga detectada",
    risk: "Bajo",
    lastScan: null,
    confidence: 95
  });
  
  const [isScanning, setIsScanning] = useState(false);

  const scanCrop = useCallback(async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const randomValue = Math.random();
    let newStatus: RoyaStatus;
    let newRisk: RoyaRisk;
    let confidence: number;
    
    if (randomValue < 0.7) {
      newStatus = "Sin plaga detectada";
      newRisk = "Bajo";
      confidence = Math.round(85 + Math.random() * 15);
    } else if (randomValue < 0.9) {
      newStatus = "Posible presencia de roya";
      newRisk = "Medio";
      confidence = Math.round(60 + Math.random() * 25);
    } else {
      newStatus = "Posible presencia de roya";
      newRisk = "Alto";
      confidence = Math.round(70 + Math.random() * 20);
    }
    
    setDetection({
      status: newStatus,
      risk: newRisk,
      lastScan: new Date(),
      confidence
    });
    
    setIsScanning(false);
  }, []);

  const getRiskColor = (risk: RoyaRisk) => {
    switch (risk) {
      case "Bajo": return "text-green-600";
      case "Medio": return "text-yellow-600";
      case "Alto": return "text-red-600";
      default: return "text-green-600";
    }
  };

  const getRiskBgColor = (risk: RoyaRisk) => {
    switch (risk) {
      case "Bajo": return "bg-green-500";
      case "Medio": return "bg-yellow-500";
      case "Alto": return "bg-red-500";
      default: return "bg-green-500";
    }
  };

  return {
    detection,
    isScanning,
    scanCrop,
    getRiskColor,
    getRiskBgColor
  };
}