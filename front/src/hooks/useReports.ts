import { useState, useCallback } from "react";
import {fileToBase64} from "@/lib/utils";
export interface CropReport {
  id: string;
  timestamp: Date;
  description: string;
  photos?: File[];
  photoUrls?: string[];
}

export function useReports() {
  const [reports, setReports] = useState<CropReport[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addReport = useCallback(async (description: string, photos?: File[]) => {
  setIsSubmitting(true);
  const photoBase64s = photos
    ? await Promise.all(photos.map(file => fileToBase64(file)))
    : [];
  
  const newReport: CropReport = {
    id: Date.now().toString(),
    timestamp: new Date(),
    description,
    photos,
    photoUrls: photoBase64s,
  };
  
  setReports(prev => [newReport, ...prev]);
  setIsSubmitting(false);
  return newReport;
}, []);

  return {
    reports,
    isSubmitting,
    addReport
  };
}