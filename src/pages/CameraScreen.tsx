import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image, X } from 'lucide-react';

export default function CameraScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    // On mobile without HTTPS, getUserMedia is blocked — use capture input directly
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      fileInputRef.current?.click();
      return;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1080, height: 1080 }
      });
      setStream(s);
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
      }, 100);
    } catch {
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setCameraActive(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    navigate('/create', { state: { imageUri: dataUrl } });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      navigate('/create', { state: { imageUri: reader.result as string } });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-foreground flex flex-col" style={{height: '100dvh'}}>
      <canvas ref={canvasRef} className="hidden" />
      {/* Camera input — opens rear camera directly on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />
      {/* Gallery input — opens photo library */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      {!cameraActive ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
            <Camera className="w-12 h-12 text-primary-foreground" />
          </div>
          <p className="text-primary-foreground/80 text-center text-lg">
            Prenez une photo de la plaie
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={startCamera}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-base"
            >
              Ouvrir la caméra
            </button>
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-full py-3.5 bg-card/10 text-primary-foreground/90 rounded-xl font-medium text-base flex items-center justify-center gap-2 border border-primary-foreground/20"
            >
              <Image className="w-5 h-5" />
              Galerie
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-4 min-h-0">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-primary-foreground/30" style={{aspectRatio: '1', maxHeight: 'calc(100vh - 180px)'}}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex items-center justify-around py-4 px-6 pb-8">
            <button
              onClick={() => galleryInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center"
            >
              <Image className="w-6 h-6 text-primary-foreground" />
            </button>
            <button
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-primary-foreground flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-foreground" />
            </button>
            <button
              onClick={() => { stopCamera(); navigate('/'); }}
              className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center"
            >
              <X className="w-6 h-6 text-primary-foreground" />
            </button>
          </div>
        </div>
      )}

      {!cameraActive && (
        <div className="p-6">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 text-primary-foreground/60 font-medium"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
}
