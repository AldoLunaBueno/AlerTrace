import { MapPin, Users, Scale, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useState } from "react";

interface FarmData {
  size: number;
  location: string;
  workers: number;
}

export default function FarmInfo() {
  const [farmData, setFarmData] = useState<FarmData>({
    size: 30,
    location: "Amazonas, Perú",
    workers: 20,
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-forest text-white px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">TARPUQKUNA</h1>
          <h2 className="text-lg font-medium opacity-90">Información de la Finca</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 pb-24 space-y-6">
        {/* Farm Size Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Tamaño de la Finca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{farmData.size}</p>
                <p className="text-sm text-muted-foreground">hectáreas</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Área total cultivada</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Equivale a {(farmData.size * 10000).toLocaleString()} m²
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-lg font-semibold text-foreground">{farmData.location}</p>
                <p className="text-sm text-muted-foreground">Región cafetera</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  💡 Ubicación óptima para cultivo de café de altura con condiciones climáticas ideales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Personal de la Finca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{farmData.workers}</p>
                <p className="text-sm text-muted-foreground">trabajadores</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Personal activo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(farmData.size / farmData.workers).toFixed(1)} ha por trabajador
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Resumen de la Finca</span>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Productividad estimada</span>
                <span className="font-semibold">{(farmData.size * 1.2).toFixed(1)} ton/año</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plantas de café aprox.</span>
                <span className="font-semibold">{(farmData.size * 5000).toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tipo de cultivo</span>
                <span className="font-semibold">Coffea arabica</span>
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 mt-4">
              <p className="text-xs text-muted-foreground">
                📊 Esta información se utiliza para calcular recomendaciones personalizadas 
                de riego, fertilización y control de plagas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Mode Note */}
        {isEditing && (
          <Card className="shadow-card border-primary/50 animate-fade-in">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                💡 La funcionalidad de edición estará disponible en una próxima actualización
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNavigation />
    </div>
  );
}