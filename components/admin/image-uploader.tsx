"use client";

import React, { useState, useRef, useCallback } from "react";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { X, Upload } from "lucide-react";
import Image from "next/image";

export type ImageDto = {
  url: string;
  alt?: string;
  caption?: string;
  isFeatured?: boolean;
};

interface ImagePreview {
  id: string;
  file: File;
  url: string;
  progress: number;
  uploaded?: ImageDto;
}

interface CombinedImage {
  url: string;
  isExisting: boolean;
  index?: number;
  alt?: string;
  id?: string;
  progress?: number;
}

export default function ImageUploader({
  onUploaded,
  multiple = true,
  existingImages = [],
  onRemoveExisting,
}: {
  onUploaded: (img: ImageDto) => void;
  multiple?: boolean;
  existingImages?: { url: string; alt?: string }[];
  onRemoveExisting?: (index: number) => void;
}) {
  const [previews, setPreviews] = useState<ImagePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));

    for (const file of fileArray) {
      const id = (crypto as { randomUUID?: () => string }).randomUUID?.() ?? String(Date.now()) + Math.random().toString(36).slice(2, 8);
      const url = URL.createObjectURL(file);

      const preview: ImagePreview = {
        id,
        file,
        url,
        progress: 0,
      };

      setPreviews(prev => [...prev, preview]);

      try {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `destinations/${id}.${ext}`;
        const storageRef = ref(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file, { contentType: file.type });

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setPreviews(prev => prev.map(p => p.id === id ? { ...p, progress } : p));
            },
            (err) => reject(err),
            async () => {
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                const imageDto: ImageDto = { url: downloadUrl, alt: "", caption: "", isFeatured: false };
                setPreviews(prev => prev.map(p => p.id === id ? { ...p, progress: 100, uploaded: imageDto } : p));
                onUploaded(imageDto);
                resolve();
              } catch (err) {
                reject(err);
              }
            }
          );
        });
      } catch (err) {
        console.error("Upload error", err);
        setPreviews(prev => prev.filter(p => p.id !== id));
      }
    }
  }, [onUploaded]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removePreview = (id: string) => {
    setPreviews(prev => {
      const preview = prev.find(p => p.id === id);
      if (preview) {
        URL.revokeObjectURL(preview.url);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const removeExisting = (index: number) => {
    onRemoveExisting?.(index);
  };

  const allImages: CombinedImage[] = [
    ...existingImages.map((img, idx) => ({ ...img, isExisting: true, index: idx })),
    ...previews.map(preview => ({ ...preview, isExisting: false }))
  ];

  return (
    <div className="space-y-4">
      {/* Images Grid - always show if there are images */}
      {allImages.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allImages.map((item) => (
              <div key={item.isExisting ? `existing-${item.index}` : `preview-${item.id}`} className="relative group">
                <Image
                  src={item.url}
                  alt={item.isExisting ? item.alt || "" : "Preview"}
                  width={150}
                  height={100}
                  className="w-full h-24 object-cover rounded-lg"
                />
                {/* Progress overlay for uploading images */}
                {!item.isExisting && item.progress! < 100 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-sm font-medium">{item.progress}%</div>
                      <div className="w-12 h-1 bg-white bg-opacity-30 rounded-full mt-1">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => item.isExisting ? removeExisting(item.index!) : removePreview(item.id!)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add more button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Add More Images</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        </div>
      ) : (
        /* Upload Area - only show when no images */
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                Drag & drop images here, or{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:text-blue-600 underline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
