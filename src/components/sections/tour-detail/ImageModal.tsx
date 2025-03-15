"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: { id: number; src: string }[];
  initialImageId?: number;
}

export default function ImageModal({
  isOpen,
  onClose,
  images,
  initialImageId,
}: ImageModalProps) {
  const [currentImageId, setCurrentImageId] = useState<number | undefined>(
    initialImageId,
  );
  const currentImageIndex = currentImageId
    ? images.findIndex((image) => image.id === currentImageId)
    : 0;
  const currentImage =
    currentImageIndex >= 0 ? images[currentImageIndex] : images[0];
  const navigateToNext = () => {
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageId(images[nextIndex].id);
  };

  const navigateToPrevious = () => {
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageId(images[prevIndex].id);
  };

  const handleThumbnailClick = (imageId: number) => {
    setCurrentImageId(imageId);
  };
  
  useEffect(() => {
    if (initialImageId) {
      // Determine which tab the image belongs to
      const image = images.find((img) => img.id === initialImageId);
      if (image) {
        setCurrentImageId(initialImageId);
      }
    }
  }, [initialImageId, images]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          navigateToPrevious();
          break;
        case "ArrowRight":
          navigateToNext();
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentImageIndex, images]);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] h-[95vh]  p-0 bg-black/40 border-none">
        <div className="flex flex-col h-full w-full relative">
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
          
        
          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Main image */}
            <div className="relative max-h-[70vh] flex items-center justify-center">
              <Image
                src={currentImage.src}
                alt={currentImage.id.toString()}
                className="max-h-[70vh] max-w-full object-contain"
                width={1000}
                height={1000}
                quality={100}
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={navigateToPrevious}
              className="absolute left-4 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={navigateToNext}
              className="absolute right-4 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Thumbnails */}
          <div className="p-2 bg-transparent overflow-x-auto">
            <div className="flex gap-2 justify-start min-w-max px-2">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={cn(
                    "w-16 h-16 relative cursor-pointer overflow-hidden rounded border-2",
                    currentImageId === image.id ? "border-white" : "border-transparent"
                  )}
                  onClick={() => handleThumbnailClick(image.id)}
                >
                  <Image
                    src={image.src}
                    alt={`Thumbnail for ${image.id}`}
                    className="object-cover size-full"
                    loading="lazy"
                    width={64}
                    height={64}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
