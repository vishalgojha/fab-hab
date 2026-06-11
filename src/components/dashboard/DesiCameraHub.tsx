import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44Stub';
import { 
  Camera, X, Sparkles, RefreshCw, Check, AlertTriangle, 
  Utensils, Droplet, Dumbbell, Award, Play, VideoOff 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DesiCameraHubProps {
  isOpen: boolean;
  onClose: () => void;
  onLogged?: () => void;
}

type ScanMode = 'food' | 'yoga' | 'water';

const MOCK_FOODS = [
  { name: 'Moong Dal Khichdi & Curd', calories: 320, protein: 11, fact: 'Ayurvedic superfood, extremely easy to digest.' },
  { name: '2 Paneer Parathas & Dahi', calories: 540, protein: 18, fact: 'High protein vegetarian breakfast option.' },
  { name: 'Masala Dosa & Sambar', calories: 380, protein: 8, fact: 'Fermented foods are great for gut health and biome.' },
  { name: 'Dal Tadka & 2 Rotis', calories: 390, protein: 15, fact: 'Perfect daily balance of essential amino acids.' },
  { name: 'Poha & Roasted Peanuts', calories: 280, protein: 6, fact: 'Lightweight carb source, rich in iron.' }
];

const MOCK_POSES = [
  { name: 'Pranamasana (Prayer Pose)', tip: 'Keep your palms firmly pressed at chest level, distribute weight evenly on both feet.' },
  { name: 'Bhujangasana (Cobra Pose)', tip: 'Lift your chest up using back muscles, keep shoulders rolled back and relaxed.' },
  { name: 'Tadasana (Mountain Pose)', tip: 'Stretch your hands upwards, lift your heels and balance on toes.' }
];

export default function DesiCameraHub({ isOpen, onClose, onLogged }: DesiCameraHubProps) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ScanMode>('food');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  // Yoga Pose State
  const [selectedPose, setSelectedPose] = useState(MOCK_POSES[0].name);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    setCaptured(false);
    setScanResult(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Unable to access camera. Please check camera permissions.');
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  // Handle Capture & AI Simulation
  const handleScan = () => {
    if (!stream || scanning) return;
    
    // Draw current video frame to canvas
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      }
    }

    setScanning(true);
    setCaptured(true);

    // Simulate AI model processing time (1.5 seconds)
    setTimeout(() => {
      setScanning(false);
      
      if (mode === 'food') {
        const food = MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)];
        setScanResult({
          type: 'food',
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          fact: food.fact
        });
      } else if (mode === 'yoga') {
        const score = Math.floor(Math.random() * 15) + 85; // 85% to 100%
        setScanResult({
          type: 'yoga',
          pose: selectedPose,
          alignment: score,
          status: score >= 90 ? 'Excellent posture! Perfect spine alignment.' : 'Good posture! Try pushing shoulders slightly back.',
          points: 25
        });
      } else if (mode === 'water') {
        const isMatka = Math.random() > 0.4;
        setScanResult({
          type: 'water',
          vessel: isMatka ? 'Traditional Clay Matka Lota' : 'Steel Hydration Glass',
          amount: isMatka ? 300 : 250,
          points: 5
        });
      }
    }, 1800);
  };

  // Log Result to database stubs
  const handleLogResult = async () => {
    if (!scanResult) return;
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      if (scanResult.type === 'food') {
        // Log meal to database
        await base44.entities.MealLog.create({
          date: todayStr,
          name: scanResult.name,
          calories: scanResult.calories,
          protein: scanResult.protein
        });
        queryClient.invalidateQueries({ queryKey: ['meal-logs'] });
        toast.success(`Logged: ${scanResult.name} (+10 pts)`);

      } else if (scanResult.type === 'water') {
        // Add water to health log
        const logs = await base44.entities.HealthLog.list();
        let todayLog = logs.find((l: any) => l.date === todayStr);
        if (todayLog) {
          const newWater = todayLog.water + 1;
          await base44.entities.HealthLog.update(todayLog.id, { water: newWater });
          if (newWater >= 8 && todayLog.water < 8) {
            toast.success('🏆 Unlocked Hydration Pro! Matka Hydration badge progress updated.');
          }
        }
        queryClient.invalidateQueries({ queryKey: ['health-logs'] });
        toast.success(`Logged: 1 Glass from ${scanResult.vessel} (+5 pts)`);

      } else if (scanResult.type === 'yoga') {
        // Award yoga points & completions
        const stats = await base44.entities.UserStats.list();
        if (stats.length > 0) {
          await base44.entities.UserStats.update(stats[0].id, {
            total_points: stats[0].total_points + scanResult.points,
            total_completions: stats[0].total_completions + 1
          });
          queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        }
        toast.success(`Yoga posture verified! +${scanResult.points} points added.`);
      }

      if (onLogged) onLogged();
      onClose();
    } catch (err) {
      console.error('Failed to log camera result:', err);
      toast.error('Error logging result');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[650px] md:h-[620px] bg-slate-900 text-white rounded-3xl z-50 overflow-hidden flex flex-col border border-slate-800 shadow-2xl shadow-violet-500/5"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-600/20 via-violet-600/20 to-yellow-600/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                  <Camera className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Desi Camera AI Hub</h3>
                  <p className="text-xs text-slate-400">Scan food, check yoga postures, or log hydration</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose} className="rounded-full text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="p-3 bg-slate-950 flex gap-2 border-b border-slate-800">
              <button
                onClick={() => { setMode('food'); setCaptured(false); setScanResult(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  mode === 'food' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                Diet Scanner
              </button>
              <button
                onClick={() => { setMode('yoga'); setCaptured(false); setScanResult(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  mode === 'yoga' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                Yoga Checker
              </button>
              <button
                onClick={() => { setMode('water'); setCaptured(false); setScanResult(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  mode === 'water' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Droplet className="w-3.5 h-3.5" />
                Water Log
              </button>
            </div>

            {/* Camera Viewport Area */}
            <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
              {/* Live Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-cover ${captured ? 'hidden' : 'block'}`}
              />

              {/* Static Captured Image canvas */}
              <canvas
                ref={canvasRef}
                width="640"
                height="480"
                className={`w-full h-full object-cover ${captured ? 'block' : 'hidden'}`}
              />

              {/* Camera Error Alert */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                  <VideoOff className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
                  <p className="text-sm font-semibold text-slate-200 mb-2">{cameraError}</p>
                  <Button onClick={startCamera} size="sm" className="bg-slate-800 hover:bg-slate-700 rounded-xl text-xs">
                    Retry Connection
                  </Button>
                </div>
              )}

              {/* Scanning Glow Line Animation */}
              {scanning && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div
                    initial={{ y: '0%' }}
                    animate={{ y: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-lg shadow-orange-500/50"
                  />
                  <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />
                </div>
              )}

              {/* Yoga Alignment overlay */}
              {!captured && mode === 'yoga' && !cameraError && (
                <div className="absolute inset-0 border-[6px] border-dashed border-violet-500/30 pointer-events-none flex flex-col items-center justify-between p-6">
                  <span className="bg-violet-900/80 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-violet-500/30">
                    Align your body inside the frame
                  </span>
                  {/* Mock wireframe skeleton lines */}
                  <div className="w-1/2 h-2/3 border-2 border-dashed border-violet-400/40 rounded-full flex items-center justify-center relative">
                    <div className="absolute h-px w-full bg-violet-400/20 top-1/4" />
                    <div className="absolute h-px w-full bg-violet-400/20 top-1/2" />
                    <div className="absolute w-px h-full bg-violet-400/20 left-1/2" />
                  </div>
                  <span className="text-[10px] text-slate-400">Keep distance of 5-8 feet</span>
                </div>
              )}

              {/* Water target frame overlay */}
              {!captured && mode === 'water' && !cameraError && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-64 border-4 border-dashed border-blue-500/40 rounded-3xl flex items-center justify-center">
                    <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider bg-blue-950/80 px-2 py-0.5 rounded">
                      Place vessel here
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls / Result Panel */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 space-y-4">
              {/* Result Information */}
              <AnimatePresence>
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3"
                  >
                    {scanResult.type === 'food' && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🍲</span>
                          <h4 className="font-bold text-orange-400">AI Food Scan Success!</h4>
                        </div>
                        <p className="text-sm font-semibold">{scanResult.name}</p>
                        <div className="flex gap-4 text-xs text-slate-400 mt-1">
                          <span>Calories: <strong className="text-white">{scanResult.calories} kcal</strong></span>
                          <span>Protein: <strong className="text-white">{scanResult.protein}g</strong></span>
                        </div>
                        <p className="text-xs text-slate-500 border-l-2 border-slate-600 pl-2 mt-2 italic">{scanResult.fact}</p>
                      </div>
                    )}

                    {scanResult.type === 'water' && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏺</span>
                          <h4 className="font-bold text-blue-400">Vessel Identified!</h4>
                        </div>
                        <p className="text-sm font-semibold">{scanResult.vessel}</p>
                        <p className="text-xs text-slate-400">Hydration logged: <strong>{scanResult.amount}ml (+1 Glass)</strong></p>
                      </div>
                    )}

                    {scanResult.type === 'yoga' && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🧘</span>
                          <h4 className="font-bold text-violet-400">Pose Alignment Checked!</h4>
                        </div>
                        <p className="text-sm font-semibold">{scanResult.pose}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">Alignment:</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
                            {scanResult.alignment}% Perfect
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2">{scanResult.status}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {captured ? (
                  <>
                    <Button 
                      onClick={startCamera} 
                      variant="outline" 
                      className="flex-1 border-slate-800 text-slate-300 hover:text-white rounded-2xl py-5"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button 
                      onClick={handleLogResult} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 rounded-2xl py-5"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save to Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    {mode === 'yoga' && (
                      <select
                        className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 w-44"
                        value={selectedPose}
                        onChange={(e) => setSelectedPose(e.target.value)}
                      >
                        {MOCK_POSES.map((pose) => (
                          <option key={pose.name} value={pose.name}>
                            {pose.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <Button
                      onClick={handleScan}
                      disabled={!stream || scanning || !!cameraError}
                      className={`flex-1 py-6 rounded-2xl shadow-lg font-bold text-sm transition-all ${
                        mode === 'food' ? 'bg-orange-500 hover:bg-orange-600 text-white' :
                        mode === 'yoga' ? 'bg-violet-600 hover:bg-violet-700 text-white' :
                        'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {scanning ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          AI Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2 fill-white" />
                          Scan Now
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>

              {/* Help tip */}
              {!captured && mode === 'yoga' && (
                <p className="text-[10px] text-slate-500 text-center italic">
                  💡 {MOCK_POSES.find(p => p.name === selectedPose)?.tip}
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
