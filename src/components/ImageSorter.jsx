import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

const ImageSorter = ({ uploadedImage }) => {
  const canvasRef = useRef(null);
  const [isSorted, setIsSorted] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => drawImage(image);
    image.src = uploadedImage;
  }, [uploadedImage]);

  const drawImage = (image) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    setIsSorted(false);
  };

  const sortPixels = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hsl = rgbToHsl(r, g, b);
      data[i + 3] = Math.floor(hsl[0] * 255); // Use hue for sorting
    }

    const sortedIndices = new Array(data.length / 4)
      .fill()
      .map((_, i) => i)
      .sort((a, b) => data[b * 4 + 3] - data[a * 4 + 3]);

    const sortedData = new Uint8ClampedArray(data.length);
    sortedIndices.forEach((srcIndex, destIndex) => {
      sortedData[destIndex * 4] = data[srcIndex * 4];
      sortedData[destIndex * 4 + 1] = data[srcIndex * 4 + 1];
      sortedData[destIndex * 4 + 2] = data[srcIndex * 4 + 2];
      sortedData[destIndex * 4 + 3] = 255;
    });

    ctx.putImageData(new ImageData(sortedData, canvas.width, canvas.height), 0, 0);
    setIsSorted(true);
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h, s, l];
  };

  const downloadImage = () => {
    toPng(canvasRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'sorted-image.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error downloading image:', err);
      });
  };

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="max-w-full h-auto mx-auto border border-gray-300" />
      <div className="flex justify-center space-x-4">
        <Button onClick={sortPixels} disabled={isSorted}>
          Sort Pixels
        </Button>
        <Button onClick={downloadImage} disabled={!isSorted}>
          <Download className="mr-2 h-4 w-4" /> Download Sorted Image
        </Button>
      </div>
    </div>
  );
};

export default ImageSorter;