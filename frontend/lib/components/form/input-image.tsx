"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
// ... existing imports ...
import { Image, Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface InputImageProps {
  control: any;
  name: string;
  onRemove: () => void;
}

const InputImage: React.FC<InputImageProps> = ({ control, name, onRemove }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // ... existing file change handler ...

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, onChange: (value: any) => void) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (onRemove: () => void) => {
    setPreview(null);
    onRemove();
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <Input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            id="imageUpload"
            onChange={(e) => handleFileChange(e, field.onChange)}
          />
          <label
            htmlFor="imageUpload"
            className={`relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl transition-all duration-300 ${
              isDragging ? "scale-[0.98] bg-primary/10" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, field.onChange)}
          >
            {preview ? (
              <div className="group relative h-full w-full overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  isZoomed
                  alt="Preview"
                  className="h-full w-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <Button
                  type="button"
                  onPress={() => handleRemove(onRemove)}
                  className="absolute right-4 top-4 z-10 border-none bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100"
                  size="sm"
                  isIconOnly
                  variant="flat"
                >
                  <Icon icon="lucide:trash-2" width={18} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Icon icon="lucide:image-plus" className="text-primary" width={32} height={32} />
                </div>
                <p className="font-medium text-default-600">Drag and drop media</p>
                <Button variant="flat" color="primary" className="mt-3 font-medium" size="sm" isDisabled>
                  Browse files
                </Button>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-600">JPG</span>
                  <span className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-600">PNG</span>
                  <span className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-600">GIF</span>
                  <span className="rounded-full bg-default-100 px-3 py-1 text-xs text-default-600">MP4</span>
                </div>
                <p className="mt-3 text-xs text-gray-400">Max size: 50MB</p>
              </div>
            )}
          </label>
        </>
      )}
    />
  );
};

// ... rest of component ...
export default InputImage;
