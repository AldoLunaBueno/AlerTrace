import { Scan, Shield, AlertTriangle, Leaf, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileNavigation } from "@/components/MobileNavigation";
import { ReportForm } from "@/components/ReportForm";
import { useRoyaDetection } from "@/hooks/useRoyaDetection";
import { useReports } from "@/hooks/useReports";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function RoyaDetection() {
  const { detection, isScanning, scanCrop, getRiskColor, getRiskBgColor } = useRoyaDetection();
  const { reports } = useReports();
  const [showReportForm, setShowReportForm] = useState(false);

  const formatLastScan = (date: Date | null) => {
    if (!date) return "No hay escaneos previos";
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-forest text-white px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">TARPUQKUNA</h1>
          <h2 className="text-lg font-medium opacity-90">Detección de Plaga</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24 space-y-6">
        {/* Status Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Estado Actual del Cultivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mb-4">
                {detection.status === "Sin plaga detectada" ? (
                  <Leaf className="h-16 w-16 text-green-600 mx-auto" />
                ) : (
                  <AlertTriangle className="h-16 w-16 text-yellow-600 mx-auto" />
                )}
              </div>
              <h3 className="text-xl font-semibold mb-2">{detection.status}</h3>
              <p className="text-sm text-muted-foreground">
                Confianza: {detection.confidence}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Nivel de Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Riesgo actual</p>
                <Badge className={cn("text-sm", getRiskColor(detection.risk))}>
                  {detection.risk}
                </Badge>
              </div>
              
              {/* Traffic Light */}
              <div className="flex flex-col space-y-2">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2",
                  detection.risk === "Alto" ? getRiskBgColor("Alto") : "bg-gray-300"
                )} />
                <div className={cn(
                  "w-4 h-4 rounded-full border-2",
                  detection.risk === "Medio" ? getRiskBgColor("Medio") : "bg-gray-300"
                )} />
                <div className={cn(
                  "w-4 h-4 rounded-full border-2",
                  detection.risk === "Bajo" ? getRiskBgColor("Bajo") : "bg-gray-300"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Reports and Observations Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showReportForm && (
              <Button
                onClick={() => setShowReportForm(true)}
                className="w-full gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Nuevo Reporte
              </Button>
            )}
            
            {showReportForm && (
              <ReportForm onClose={() => setShowReportForm(false)} />
            )}
            
            {reports.length > 0 && (
              <div className="space-y-3 mt-4">
                <h4 className="text-sm font-medium">Reportes Recientes</h4>
                {reports.slice(0, 3).map((report) => (
                  <div key={report.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-muted-foreground">
                        {report.timestamp.toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-sm">{report.description}</p>
                    {report.photoUrls && report.photoUrls.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {report.photoUrls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Reporte ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm">Más información</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Verde:</strong> Sin signos de plaga detectados. Cultivo saludable.
            </p>
            <p>
              <strong>Amarillo:</strong> Posibles signos tempranos. Monitoreo recomendado.
            </p>
            <p>
              <strong>Rojo:</strong> Signos evidentes de plaga. Acción inmediata requerida.
            </p>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
}