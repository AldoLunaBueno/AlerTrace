import { useState, useRef } from "react";
import { Camera, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useReports } from "@/hooks/useReports";
import { useToast } from "@/hooks/use-toast";

interface ReportFormProps {
  onClose: () => void;
}

export function ReportForm({ onClose }: ReportFormProps) {
  const [description, setDescription] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addReport, isSubmitting } = useReports();
  const { toast } = useToast();

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setSelectedPhotos(prev => [...prev, ...files]);
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllPhotos = () => {
    setSelectedPhotos([]);
    setPhotoPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Por favor describe los síntomas observados",
        variant: "destructive",
      });
      return;
    }

    try {
      await addReport(description, selectedPhotos);
      toast({
        title: "Foto recibidas",
        description: "Analizando fotografías...",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Nuevo Reporte</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Describe los síntomas observados
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe detalladamente los síntomas que observas en el cultivo..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Fotos (obligatorio)
            </label>
            
            {photoPreviews.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                    Añadir más
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeAllPhotos}
                  >
                    Quitar todas
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 border-dashed gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-5 w-5" />
                Tomar fotos
              </Button>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gap-2"
              disabled={isSubmitting || !description.trim()}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Enviando..." : "Enviar Reporte"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}