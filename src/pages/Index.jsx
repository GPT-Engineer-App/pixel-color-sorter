import React, { useState } from 'react';
import DragDropUploader from '../components/DragDropUploader';
import ImageSorter from '../components/ImageSorter';

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Pixel Color Sorter</h1>
        <DragDropUploader setUploadedImage={setUploadedImage} />
        {uploadedImage && <ImageSorter uploadedImage={uploadedImage} />}
      </div>
    </div>
  );
};

export default Index;