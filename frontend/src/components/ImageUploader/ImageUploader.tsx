import React, { useState } from 'react';

interface ImageUploaderProps {
  currentImage: string;
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload }) => {
  const [preview, setPreview] = useState(currentImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  return (
    <div>
      <img src={preview} alt="Profile Preview" />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

export default ImageUploader;
