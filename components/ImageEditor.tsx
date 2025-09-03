import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';

interface ImageEditorProps {
  originalImage: string;
  brushSize: number;
  onMaskChange: (maskDataUrl: string) => void;
}

export interface ImageEditorRef {
  undo: () => void;
  clear: () => void;
}

const ImageEditor = forwardRef<ImageEditorRef, ImageEditorProps>(
  ({ originalImage, brushSize, onMaskChange }, ref) => {
    const brushCursor = useMemo(() => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 21.668l6.021-6.021 2.332 2.332-6.021 6.021zm3.393-3.393l2.332 2.332 14.296-14.296-2.332-2.332z" fill="white" stroke="black" stroke-width="0.5"/></svg>`;
        // The hotspot is the bottom-left tip of the brush. For this 24x24 SVG, it's at (0, 22).
        return `url('data:image/svg+xml;base64,${btoa(svg)}') 0 22, crosshair`;
    }, []);

    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<ImageData[]>([]);

    const getCanvasContext = (canvas: HTMLCanvasElement | null) => canvas?.getContext('2d');

    const createBlackAndWhiteMask = useCallback((sourceCanvas: HTMLCanvasElement): string => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceCanvas.width;
        tempCanvas.height = sourceCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return '';
        
        tempCtx.fillStyle = 'black';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(sourceCanvas, 0, 0);
        
        return tempCanvas.toDataURL('image/png');
    }, []);

    const pushToHistory = useCallback(() => {
        const maskCtx = getCanvasContext(maskCanvasRef.current);
        const maskCanvas = maskCanvasRef.current;
        if (maskCtx && maskCanvas) {
            const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
            setHistory(prev => [...prev, imageData]);
        }
    }, []);

    const updatePreviewFromMask = useCallback(() => {
        const maskCanvas = maskCanvasRef.current;
        const previewCanvas = previewCanvasRef.current;
        if (!maskCanvas || !previewCanvas) return;
        const previewCtx = getCanvasContext(previewCanvas);
        if (!previewCtx) return;

        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.drawImage(maskCanvas, 0, 0);
        previewCtx.globalCompositeOperation = 'source-in';
        previewCtx.fillStyle = 'rgba(79, 70, 229, 0.5)'; // Tailwind indigo-600 with 50% opacity
        previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.globalCompositeOperation = 'source-over'; // Reset
    }, []);

    const drawImage = useCallback(() => {
      const image = new Image();
      image.src = originalImage;
      image.onload = () => {
        const container = containerRef.current;
        const bgCanvas = bgCanvasRef.current;
        const previewCanvas = previewCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (!container || !bgCanvas || !previewCanvas || !maskCanvas) return;

        const { clientWidth, clientHeight } = container;
        const imgAspectRatio = image.width / image.height;
        const containerAspectRatio = clientWidth / clientHeight;

        let canvasWidth, canvasHeight;
        if (imgAspectRatio > containerAspectRatio) {
          canvasWidth = clientWidth;
          canvasHeight = clientWidth / imgAspectRatio;
        } else {
          canvasHeight = clientHeight;
          canvasWidth = clientHeight * imgAspectRatio;
        }

        [bgCanvas, previewCanvas, maskCanvas].forEach(canvas => {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        });
        
        const bgCtx = getCanvasContext(bgCanvas);
        bgCtx?.drawImage(image, 0, 0, canvasWidth, canvasHeight);

        const maskCtx = getCanvasContext(maskCanvas);
        if (maskCtx) {
          maskCtx.clearRect(0, 0, canvasWidth, canvasHeight);
          setHistory([]); // Reset history for new image
          pushToHistory();
          onMaskChange(createBlackAndWhiteMask(maskCanvas));
        }
        updatePreviewFromMask(); // Clear any old preview mask
      };
    }, [originalImage, pushToHistory, updatePreviewFromMask, createBlackAndWhiteMask, onMaskChange]);

    useEffect(() => {
      drawImage();
      window.addEventListener('resize', drawImage);
      return () => {
        window.removeEventListener('resize', drawImage);
      };
    }, [drawImage]);

    useImperativeHandle(ref, () => ({
      undo: () => {
        if (history.length > 1) {
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory.pop(); // Remove current state
                const lastState = newHistory[newHistory.length - 1];
                const maskCtx = getCanvasContext(maskCanvasRef.current);
                const maskCanvas = maskCanvasRef.current;
                if (maskCtx && lastState && maskCanvas) {
                    maskCtx.putImageData(lastState, 0, 0);
                    updatePreviewFromMask();
                    onMaskChange(createBlackAndWhiteMask(maskCanvas));
                }
                return newHistory;
            });
        }
      },
      clear: () => {
        const maskCanvas = maskCanvasRef.current;
        const maskCtx = getCanvasContext(maskCanvas);
        if (maskCtx && maskCanvas) {
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            updatePreviewFromMask();
            onMaskChange(createBlackAndWhiteMask(maskCanvas));
            setHistory([]);
            pushToHistory();
        }
      },
    }));

    const getCoords = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
      const canvas = previewCanvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX === undefined || clientY === undefined) return null;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      const maskCtx = getCanvasContext(maskCanvasRef.current);
      if (!maskCtx) return;
      const coords = getCoords(e);
      if (!coords) return;

      setIsDrawing(true);
      maskCtx.beginPath();
      maskCtx.moveTo(coords.x, coords.y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault(); // Prevent scrolling on touch devices
      
      const maskCtx = getCanvasContext(maskCanvasRef.current);
      if (!maskCtx) return;
      const coords = getCoords(e);
      if (!coords) return;
      
      maskCtx.lineWidth = brushSize;
      maskCtx.lineCap = 'round' as const;
      maskCtx.lineJoin = 'round' as const;
      maskCtx.strokeStyle = 'white';
      
      maskCtx.lineTo(coords.x, coords.y);
      maskCtx.stroke();
      
      updatePreviewFromMask();
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      const maskCtx = getCanvasContext(maskCanvasRef.current);
      const maskCanvas = maskCanvasRef.current;
      if (!maskCtx || !maskCanvas) return;

      maskCtx.closePath();
      setIsDrawing(false);

      pushToHistory();
      onMaskChange(createBlackAndWhiteMask(maskCanvas));
    };

    return (
      <div ref={containerRef} className="w-full h-full relative touch-none" style={{ minHeight: '50vh' }}>
        <canvas
          ref={bgCanvasRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full"
        />
         <canvas
          ref={previewCanvasRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full"
          style={{ cursor: brushCursor }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
      </div>
    );
  }
);

export default ImageEditor;