import { useState, useEffect, useCallback } from "react";

export interface SensorReading {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  ph: number;
  npk: number;
  soilHumidity: number;
  sunlight: number;
}

export function useSensorData() {
  const zeroData = {
    temperature: 0,
    humidity: 0,
    ph: 0,
    npk: 0,
    soilHumidity: 0,
    sunlight: 0,
  };

  const [currentData, setCurrentData] = useState<Omit<SensorReading, "id" | "timestamp">>(zeroData);
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Función para generar número aleatorio dentro de un rango
  const getRandomInRange = (min: number, max: number) =>
    parseFloat((Math.random() * (max - min) + min).toFixed(1));

  const refreshData = useCallback(async () => {
    console.log("%c[FRONT] Generando datos simulados...", "color: blue; font-weight: bold");

    try {
      setIsRefreshing(true);

      // 🚀 Aquí simulamos los valores
      const simulatedData = {
        temperature: getRandomInRange(15, 35),
        humidity: getRandomInRange(30, 90),
        ph: getRandomInRange(4.5, 8),
        npk: getRandomInRange(100, 1000),
        soilHumidity: getRandomInRange(20, 80),
        sunlight: getRandomInRange(10, 100),
      };

      setCurrentData(simulatedData);

      const newReading: SensorReading = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...simulatedData,
      };

      setHistory((prev) => {
        const updated = [newReading, ...prev].slice(0, 50);
        console.log("%c[FRONT] Historial actualizado:", "color: orange; font-weight: bold", updated);
        return updated;
      });
    } catch (err) {
      console.error("%c[FRONT] Error simulando datos:", "color: red; font-weight: bold", err);
    } finally {
      setIsRefreshing(false);
      console.log("%c[FRONT] Finalizó ciclo de actualización", "color: gray; font-weight: bold");
    }
  }, []);

  // Llamar a refreshData cada 15 segundos
  useEffect(() => {
    console.log("%c[FRONT] Cargando datos iniciales (simulados)...", "color: teal; font-weight: bold");
    refreshData();
    const interval = setInterval(refreshData, 15000);
    return () => {
      console.log("%c[FRONT] Deteniendo actualizaciones", "color: darkred; font-weight: bold");
      clearInterval(interval);
    };
  }, [refreshData]);

  return {
    currentData,
    history,
    isRefreshing,
    refreshData,
  };
}
