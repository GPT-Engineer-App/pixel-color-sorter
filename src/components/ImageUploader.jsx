import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const ImageUploader = ({ setUploadedImage }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-8">
      <label htmlFor="image-upload" className="block">
        <Button className="w-full">
          <Upload className="mr-2 h-4 w-4" /> Upload Image
        </Button>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;