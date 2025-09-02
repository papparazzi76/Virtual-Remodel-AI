import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, useCallback } from 'react';

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
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<ImageData[]>([]);

    const getCanvasContext = (canvas: HTMLCanvasElement | null) => canvas?.getContext('2d');

    const drawImage = useCallback(() => {
      const image = new Image();
      image.src = originalImage;
      image.onload = () => {
        const container = containerRef.current;
        const bgCanvas = bgCanvasRef.current;
        const drawingCanvas = drawingCanvasRef.current;
        if (!container || !bgCanvas || !drawingCanvas) return;

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

        [bgCanvas, drawingCanvas].forEach(canvas => {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        });
        
        const bgCtx = getCanvasContext(bgCanvas);
        bgCtx?.drawImage(image, 0, 0, canvasWidth, canvasHeight);

        const drawingCtx = getCanvasContext(drawingCanvas);
        if (drawingCtx) {
          drawingCtx.fillStyle = 'black';
          drawingCtx.fillRect(0, 0, canvasWidth, canvasHeight);
          pushToHistory();
        }
      };
    }, [originalImage]);

    useEffect(() => {
      drawImage();
      // Add resize listener
      window.addEventListener('resize', drawImage);
      return () => {
        window.removeEventListener('resize', drawImage);
      };
    }, [drawImage]);

    const pushToHistory = () => {
        const drawingCtx = getCanvasContext(drawingCanvasRef.current);
        const drawingCanvas = drawingCanvasRef.current;
        if (drawingCtx && drawingCanvas) {
            const imageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
            setHistory(prev => [...prev, imageData]);
        }
    };

    useImperativeHandle(ref, () => ({
      undo: () => {
        if (history.length > 1) {
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory.pop(); // Remove current state
                const lastState = newHistory[newHistory.length - 1];
                const drawingCtx = getCanvasContext(drawingCanvasRef.current);
                if (drawingCtx && lastState) {
                    drawingCtx.putImageData(lastState, 0, 0);
                    onMaskChange(drawingCanvasRef.current!.toDataURL('image/png'));
                }
                return newHistory;
            });
        }
      },
      clear: () => {
        const drawingCanvas = drawingCanvasRef.current;
        const drawingCtx = getCanvasContext(drawingCanvas);
        if (drawingCtx && drawingCanvas) {
            drawingCtx.fillStyle = 'black';
            drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            onMaskChange(drawingCanvas.toDataURL('image/png'));
            setHistory([]);
            pushToHistory();
        }
      },
    }));

    const getCoords = (e: React.MouseEvent): { x: number; y: number } => {
      const canvas = drawingCanvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDrawing = (e: React.MouseEvent) => {
      const drawingCtx = getCanvasContext(drawingCanvasRef.current);
      if (!drawingCtx) return;
      setIsDrawing(true);
      const { x, y } = getCoords(e);
      drawingCtx.beginPath();
      drawingCtx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const drawingCtx = getCanvasContext(drawingCanvasRef.current);
      if (!drawingCtx) return;

      const { x, y } = getCoords(e);
      drawingCtx.lineTo(x, y);
      drawingCtx.strokeStyle = 'white';
      drawingCtx.lineWidth = brushSize;
      drawingCtx.lineCap = 'round';
      drawingCtx.lineJoin = 'round';
      drawingCtx.stroke();
    };

    const stopDrawing = () => {
      const drawingCtx = getCanvasContext(drawingCanvasRef.current);
      if (!drawingCtx) return;
      drawingCtx.closePath();
      setIsDrawing(false);
      pushToHistory();
      onMaskChange(drawingCanvasRef.current!.toDataURL('image/png'));
    };

    return (
      <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '50vh' }}>
        <canvas
          ref={bgCanvasRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full"
        />
        <canvas
          ref={drawingCanvasRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full max-h-full cursor-crosshair mix-blend-screen"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    );
  }
);

export default ImageEditor;