import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

const ImageSorter = ({ uploadedImage }) => {
  const canvasRef = useRef(null);
  const [isSorting, setIsSorting] = useState(false);
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

  const sortPixels = async () => {
    setIsSorting(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    const pixelArray = [];
    for (let i = 0; i < data.length; i += 4) {
      pixelArray.push({
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
        a: data[i + 3],
        index: i,
      });
    }

    const sortedPixels = pixelArray.sort((a, b) => {
      const hslA = rgbToHsl(a.r, a.g, a.b);
      const hslB = rgbToHsl(b.r, b.g, b.b);
      return hslB[0] - hslA[0];
    });

    const totalSteps = 100;
    const delay = 3000 / totalSteps;

    for (let step = 0; step <= totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, delay));

      const progress = step / totalSteps;
      const newData = new Uint8ClampedArray(data.length);

      for (let i = 0; i < sortedPixels.length; i++) {
        const pixel = sortedPixels[i];
        const targetIndex = Math.floor(i * progress + pixel.index * (1 - progress));
        newData[targetIndex] = pixel.r;
        newData[targetIndex + 1] = pixel.g;
        newData[targetIndex + 2] = pixel.b;
        newData[targetIndex + 3] = pixel.a;
      }

      ctx.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
    }

    setIsSorting(false);
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
        <Button onClick={sortPixels} disabled={isSorting || isSorted}>
          {isSorting ? 'Sorting...' : 'Sort Pixels'}
        </Button>
        <Button onClick={downloadImage} disabled={!isSorted}>
          <Download className="mr-2 h-4 w-4" /> Download Sorted Image
        </Button>
      </div>
    </div>
  );
};

export default ImageSorter;