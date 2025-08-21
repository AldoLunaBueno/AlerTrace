import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileNavigation } from "@/components/MobileNavigation";
import { useSensorData } from "@/hooks/useSensorData";

export default function Charts() {
  const { history } = useSensorData();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Prepare data for charts (last 10 readings)
    const recentData = history.slice(0, 10).reverse().map((reading, index) => ({
      time: reading.timestamp.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      temperature: reading.temperature,
      humidity: reading.humidity,
      ph: reading.ph,
      npk: reading.npk,
      index
    }));
    
    setChartData(recentData);
  }, [history]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-earth text-white px-6 pt-12 pb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">TARPUQKUNA</h1>
          <h2 className="text-lg font-medium opacity-90">Gráficas de Sensores</h2>
        </div>
      </header>

      {/* Charts Content */}
      <main className="px-6 py-6 pb-24 space-y-8">
        {/* Temperature Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-temperature">
              <div className="w-3 h-3 rounded-full bg-temperature"></div>
              Evolución de Temperatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="hsl(var(--temperature))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--temperature))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--temperature))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Humidity Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-humidity">
              <div className="w-3 h-3 rounded-full bg-humidity"></div>
              Evolución de Humedad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="hsl(var(--humidity))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--humidity))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--humidity))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* pH Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-ph">
              <div className="w-3 h-3 rounded-full bg-ph"></div>
              Niveles de pH
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ph" 
                    stroke="hsl(var(--ph))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--ph))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "hsl(var(--ph))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* NPK Bar Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-npk">
              <div className="w-3 h-3 rounded-full bg-npk"></div>
              Niveles de NPK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="npk" 
                    fill="hsl(var(--npk))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
}