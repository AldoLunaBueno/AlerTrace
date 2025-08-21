import { Clock, Thermometer, Droplets, TestTube, Beaker, Sprout, Filter, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useSensorData } from "@/hooks/useSensorData";
import { cn } from "@/lib/utils";
import { useState } from "react";

type SensorFilter = "all" | "temperature" | "humidity" | "ph" | "npk" | "soil" | "sunlight";

export default function History() {
  const { history } = useSensorData();
  const [selectedFilter, setSelectedFilter] = useState<SensorFilter>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Crítico": return "bg-destructive text-destructive-foreground";
      case "Regular": return "bg-yellow-500 text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  };

  const filterButtons = [
    { id: "all" as SensorFilter, label: "Todos", icon: Filter },
    { id: "temperature" as SensorFilter, label: "Temperatura", icon: Thermometer },
    { id: "humidity" as SensorFilter, label: "Humedad", icon: Droplets },
    { id: "ph" as SensorFilter, label: "pH", icon: TestTube },
    { id: "npk" as SensorFilter, label: "NPK", icon: Beaker },
    { id: "soil" as SensorFilter, label: "Humedad del suelo", icon: Sprout },
    { id: "sunlight" as SensorFilter, label: "Luz Solar", icon: Sun },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-sky text-white px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">TARPUQKUNA</h1>
          <h2 className="text-lg font-medium opacity-90">Historial de Mediciones</h2>
        </div>
      </header>

      {/* History Content */}
      <main className="px-6 py-6 pb-24">
        {/* Filter Buttons */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Filtrar por sensor:</h3>
          <div className="flex flex-wrap gap-3">
            {filterButtons.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "default" : "outline"}
                  size="default"
                  onClick={() => setSelectedFilter(filter.id)}
                  className="gap-2 min-h-[44px] text-sm"
                >
                  <Icon className="h-4 w-4" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {history.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay mediciones disponibles</p>
              </CardContent>
            </Card>
          ) : (
            history.map((reading, index) => (
              <Card key={reading.id} className={cn(
                "shadow-card animate-fade-in transition-all duration-300",
                index === 0 && "ring-2 ring-primary/20"
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {formatTime(reading.timestamp)}
                    </CardTitle>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Más reciente
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Temperature */}
                    {(selectedFilter === "all" || selectedFilter === "temperature") && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-temperature/20">
                          <Thermometer className="h-4 w-4 text-temperature" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Temperatura</p>
                          <p className="text-sm font-semibold">{reading.temperature}°C</p>
                        </div>
                      </div>
                    )}

                    {/* Humidity */}
                    {(selectedFilter === "all" || selectedFilter === "humidity") && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-humidity/20">
                          <Droplets className="h-4 w-4 text-humidity" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Humedad</p>
                          <p className="text-sm font-semibold">{reading.humidity}%</p>
                        </div>
                      </div>
                    )}

                    {/* pH */}
                    {(selectedFilter === "all" || selectedFilter === "ph") && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-ph/20">
                          <TestTube className="h-4 w-4 text-ph" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">pH</p>
                          <p className="text-sm font-semibold">{reading.ph}</p>
                        </div>
                      </div>
                    )}

                    {/* NPK */}
                    {(selectedFilter === "all" || selectedFilter === "npk") && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-npk/20">
                          <Beaker className="h-4 w-4 text-npk" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">NPK</p>
                          <p className="text-sm font-semibold">{reading.npk} ppm</p>
                        </div>
                      </div>
                    )}

                    {/* Soil moisture */}
                    {(selectedFilter === "all" || selectedFilter === "soil") && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-soil/20">
                          <Sprout className="h-4 w-4 text-soil" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Humedad del suelo</p>
                          <p className="text-sm font-semibold">{reading.soilHumidity}%</p>
                        </div>
                      </div>
                    )}

                    {/* Sunlight */}
                    {(selectedFilter === "all" || selectedFilter === "sunlight") && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-sunlight/20">
                          <Sun className="h-4 w-4 text-sunlight" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Luz Solar</p>
                          <p className="text-sm font-semibold">{reading.sunlight}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Mostrando las últimas {history.length} mediciones
          </p>
        </div>
      </main>

      <MobileNavigation />
    </div>
  );
}