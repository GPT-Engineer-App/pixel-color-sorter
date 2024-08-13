import React from 'react';
import ImageUploader from '../components/ImageUploader';
import ImageSorter from '../components/ImageSorter';
import { useState } from 'react';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Pixel Color Sorter</h1>
        <ImageUploader setUploadedImage={setUploadedImage} />
        {uploadedImage && <ImageSorter uploadedImage={uploadedImage} />}
      </div>
    </div>
  );
};

export default Index;