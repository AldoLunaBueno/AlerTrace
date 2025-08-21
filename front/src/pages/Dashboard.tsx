import { Thermometer, Droplets, TestTube, Beaker, Sprout, RefreshCw, Sun, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SensorCard } from "@/components/SensorCard";
import { useSensorData } from "@/hooks/useSensorData";
import { MobileNavigation } from "@/components/MobileNavigation";

export default function Dashboard() {
  const { currentData, isRefreshing, refreshData } = useSensorData();

  const getSoilHumidityStatus = (humidity: number) => {
    if (humidity < 30) return "critical";
    if (humidity < 50) return "warning";
    return "good";
  };

  const getSunlightStatus = (sunlight: number) => {
    if (sunlight < 50) return "warning";
    if (sunlight > 90) return "critical";
    return "good";
  };

  const getRoyaWarnings = () => {
    const warnings = [];
    
    // Humedad alta favorece la roya
    if (currentData.humidity > 70) {
      warnings.push("Humedad ambiental alta: Reducir riego y mejorar ventilación para prevenir roya");
    }
    
    // Humedad del suelo alta propicia roya
    if (currentData.soilHumidity > 70) {
      warnings.push("Humedad del suelo alta: Evitar encharcamiento, mejorar drenaje");
    }
    
    // Temperatura muy alta o muy baja puede causar estrés
    if (currentData.temperature > 28 || currentData.temperature < 18) {
      warnings.push("Temperatura fuera del rango ideal: Proporcionar sombra o protección según sea necesario");
    }
    
    return warnings;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className="relative text-white px-6 pt-12 pb-8 bg-cover bg-center"
        style={{ backgroundImage: "url('fondoweb.png')" }}
      >
        <div className="bg-black bg-opacity-30 absolute inset-0"></div>
        <div className="relative text-center flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img
              src="logo_sq1.png"
              alt="Logo TARPUQKUNA"
              className="w-12 h-12 object-contain opacity-100"
            />
            <h1 className="text-2xl font-bold drop-shadow-lg">TARPUQKUNA</h1>
          </div>
          <h2 className="text-lg font-medium opacity-90 mt-2">
            Monitoreo de Cultivo
          </h2>
        </div>
      </header>


      {/* Main Content */}
      <main className="px-6 py-6 pb-24">
        {/* Refresh Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2 min-h-[48px] px-6 text-base font-semibold active:scale-95 transition-transform"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Refrescar Datos'}
          </Button>
        </div>

        {/* Sensor Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <SensorCard
            title="Temperatura"
            value={currentData.temperature}
            unit="°C"
            icon={Thermometer}
            colorClass="bg-temperature"
            status="good"
          />
          
          <SensorCard
            title="Humedad"
            value={currentData.humidity}
            unit="%"
            icon={Droplets}
            colorClass="bg-humidity"
            status="good"
          />
          
          <SensorCard
            title="Acidez del suelo"
            value={currentData.ph}
            unit=""
            icon={TestTube}
            colorClass="bg-ph"
            status="good"
          />
          
          <SensorCard
            title="Nutrientes del suelo"
            value={currentData.npk}
            unit="ppm"
            icon={Beaker}
            colorClass="bg-npk"
            status="good"
          />
          
          <SensorCard
            title="Humedad del Suelo"
            value={currentData.soilHumidity}
            unit="%"
            icon={Sprout}
            colorClass="bg-soil"
            status={getSoilHumidityStatus(currentData.soilHumidity)}
          />
          
          <SensorCard
            title="Luz Solar"
            value={currentData.sunlight}
            unit="%"
            icon={Sun}
            colorClass="bg-sunlight"
            status={getSunlightStatus(currentData.sunlight)}
          />
        </div>

        {/* Roya Warnings */}
        {getRoyaWarnings().length > 0 && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">
                  ⚠️ Condiciones favorables para la roya detectadas
                </h3>
                <ul className="space-y-1">
                  {getRoyaWarnings().map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Last Update Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleTimeString('es-ES')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Los datos se actualizan automáticamente cada 15 segundos
          </p>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}