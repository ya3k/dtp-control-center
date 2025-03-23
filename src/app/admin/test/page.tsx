"use client";

import { useState } from "react";
import uploadApiRequest from "@/apiRequests/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Clear any previous uploaded URL
      setUploadedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    try {
      // Simplified API call - just pass the file
      const response = await uploadApiRequest.uploadTourImage(file);
      
      console.log("Upload response:", response);
      
      if (response?.urls && response.urls.length > 0) {
        setUploadedUrl(response.urls[0]);
        toast.success("Image uploaded successfully!");
      } else {
        console.error("Unexpected response format:", response);
        toast.error("Unexpected response format");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // For destination images
  const handleDestinationUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const response = await uploadApiRequest.uploadDestinationImage(file);
      if (response?.urls && response.urls.length > 0) {
        setUploadedUrl(response.urls[0]);
        toast.success("Destination image uploaded successfully!");
      }
    } catch (error) {
      toast.error(`Upload failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Test Image Upload</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1"
              disabled={isUploading}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading Tour...
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    Upload Tour
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleDestinationUpload} 
                disabled={!file || isUploading}
                variant="outline"
                className="gap-2"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Destination
              </Button>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Preview:</h3>
              <div className="relative w-full h-64 border rounded-md overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          {uploadedUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Uploaded Image:</h3>
              <div className="relative w-full h-64 border rounded-md overflow-hidden">
                <Image
                  src={uploadedUrl}
                  alt="Uploaded image"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground break-all">
                <span className="font-medium">URL:</span> {uploadedUrl}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}