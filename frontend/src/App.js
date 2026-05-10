import React, { useState, useEffect, useRef } from 'react';
import { Camera, Square, Move3d, Save, RefreshCw, Layers, VideoOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import './App.css';

const AquariumVisualizer = () => {
  const [scanningState, setScanningState] = useState('initial');
  const [dimensions, setDimensions] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedSetups, setSavedSetups] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState('');

  // Fetch setups from backend on mount
  useEffect(() => {
    fetchSetups();
  }, []);

  const fetchSetups = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/setups');
      if (res.ok) {
        const data = await res.json();
        setSavedSetups(data);
      }
    } catch (error) {
      console.error("Failed to fetch setups:", error);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError('Camera access denied or not available.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (activeTab === 'scanner' && (scanningState === 'initial' || scanningState === 'scanning')) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, scanningState]);

  const detectSpace = () => {
    setScanningState('scanning');
    setTimeout(() => {
      setScanningState('detected');
      setDimensions({
        width: 120,
        height: 60,
        depth: 45
      });
    }, 2500);
  };

  const generateSetup = () => {
    setShowPreview(true);
  };

  const saveSetup = async () => {
    setIsSaving(true);
    try {
      const setupData = {
        title: `Setup ${savedSetups.length + 1} - ${dimensions.width}cm`,
        dimensions: dimensions,
        tankVolume: '100L',
        lighting: 'Adjustable LED Spectrum',
        filtration: 'Canister filter (200L/hr)',
        substrate: 'Fine gravel (2-3cm)',
        plants: 'Anubias, Java Fern',
        fishCapacity: '15-20 small tropical fish'
      };

      const res = await fetch('http://localhost:5000/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData)
      });

      if (res.ok) {
        await fetchSetups();
        alert('Setup saved successfully!');
        setScanningState('initial');
        setShowPreview(false);
        setDimensions(null);
        setActiveTab('gallery');
      }
    } catch (error) {
      console.error("Failed to save setup:", error);
      alert('Error saving setup.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full min-h-screen py-8 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-50 opacity-40 mix-blend-screen"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-beautiful-underwater-shot-of-a-coral-reef-13009-large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-ocean-900/60 backdrop-blur-sm -z-40"></div>
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl flex items-center justify-between mb-8 glass-panel p-6"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-teal to-blue-400">
            AR Aquarium Visualizer
          </h1>
          <p className="text-ocean-300 mt-1">Design your perfect aquatic ecosystem</p>
        </div>
        <Camera className="w-10 h-10 text-neon-teal drop-shadow-neon" />
      </motion.div>

      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex gap-4 mb-8"
      >
        <button 
          onClick={() => setActiveTab('scanner')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${activeTab === 'scanner' ? 'bg-neon-teal text-ocean-900 shadow-neon' : 'bg-ocean-800/50 text-ocean-100 hover:bg-ocean-700/50'}`}
        >
          AR Scanner
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-neon-teal text-ocean-900 shadow-neon' : 'bg-ocean-800/50 text-ocean-100 hover:bg-ocean-700/50'}`}
        >
          <Layers size={18} /> Saved Gallery
        </button>
      </motion.div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'scanner' ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-4xl space-y-6"
          >
            {/* AR Scanner Window */}
            <div className="glass-panel overflow-hidden relative aspect-[16/9] w-full flex items-center justify-center border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              {/* Real Camera Feed */}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
              {/* Fallback Background if camera error */}
              {(cameraError || !videoRef.current?.srcObject) && (
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-900/80 to-ocean-800/80 -z-20 mix-blend-overlay"></div>
              )}
              
              {scanningState === 'initial' && (
                <div className="flex flex-col items-center gap-4">
                  {cameraError && (
                    <div className="bg-red-500/20 backdrop-blur-md text-red-200 px-4 py-2 rounded-lg flex items-center gap-2 border border-red-500/50">
                      <VideoOff size={18} />
                      {cameraError}
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={detectSpace}
                    className="bg-white/20 backdrop-blur-md border border-white/50 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-3 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] hover:bg-white/30 transition-all"
                  >
                    <Square className="w-6 h-6" />
                    Initiate Room Scan
                  </motion.button>
                </div>
              )}
              
              {scanningState === 'scanning' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-neon-teal flex flex-col items-center gap-4"
                >
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  >
                    <Move3d className="w-16 h-16" />
                  </motion.div>
                  <p className="text-xl font-medium tracking-wider animate-pulse">Mapping environment geometry...</p>
                  
                  {/* Fake scanning grid lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div 
                      initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="w-full h-1 bg-neon-teal/50 shadow-neon absolute"
                    />
                  </div>
                </motion.div>
              )}

              {scanningState === 'detected' && !showPreview && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="text-center bg-white/10 p-8 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] z-10"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white drop-shadow-md mb-2">Optimal Space Detected</h3>
                    <p className="text-white/90 text-lg drop-shadow-sm">
                      {dimensions.width}cm × {dimensions.height}cm × {dimensions.depth}cm
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={generateSetup}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white font-bold px-6 py-3 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all"
                  >
                    Generate Ecosystem Blueprint
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Results Preview */}
            <AnimatePresence>
              {showPreview && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <Alert>
                    <AlertTitle>Recommended Aquarium Architecture</AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="glass-panel p-4 bg-ocean-800/30">
                          <p className="text-neon-teal font-medium mb-1">Dimensions</p>
                          <p>100L ({dimensions.width}x{dimensions.height}x{dimensions.depth}cm)</p>
                        </div>
                        <div className="glass-panel p-4 bg-ocean-800/30">
                          <p className="text-neon-teal font-medium mb-1">Lighting</p>
                          <p>Adjustable LED Spectrum</p>
                        </div>
                        <div className="glass-panel p-4 bg-ocean-800/30">
                          <p className="text-neon-teal font-medium mb-1">Filtration</p>
                          <p>Canister filter (200L/hr)</p>
                        </div>
                        <div className="glass-panel p-4 bg-ocean-800/30">
                          <p className="text-neon-teal font-medium mb-1">Livestock</p>
                          <p>15-20 small tropical fish</p>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-4 justify-end">
                    <button 
                      onClick={() => {
                        setScanningState('initial');
                        setShowPreview(false);
                        setDimensions(null);
                      }}
                      className="px-6 py-3 rounded-lg font-medium border border-ocean-300 text-ocean-100 hover:bg-ocean-800 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw size={18} /> Rescan
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={saveSetup}
                      disabled={isSaving}
                      className="bg-neon-teal text-ocean-900 px-6 py-3 rounded-lg font-bold shadow-neon flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={18} /> {isSaving ? 'Saving...' : 'Save Configuration'}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-4xl"
          >
            <h2 className="text-2xl font-semibold mb-6 text-neon-teal">Your Saved Ecosystems</h2>
            {savedSetups.length === 0 ? (
              <div className="glass-panel p-12 text-center text-ocean-300">
                <p className="text-lg">No ecosystems designed yet.</p>
                <p className="text-sm mt-2">Head back to the scanner to create your first aquarium!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedSetups.map((setup) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={setup._id} 
                    className="glass-panel p-6 border-l-4 border-l-neon-teal relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Layers size={64} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{setup.title}</h3>
                    <p className="text-ocean-300 text-sm mb-4">Saved on: {new Date(setup.createdAt).toLocaleDateString()}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-ocean-700/50 pb-1">
                        <span className="text-ocean-100">Volume</span>
                        <span className="font-medium">{setup.tankVolume}</span>
                      </div>
                      <div className="flex justify-between border-b border-ocean-700/50 pb-1">
                        <span className="text-ocean-100">Filter</span>
                        <span className="font-medium text-right max-w-[150px] truncate">{setup.filtration}</span>
                      </div>
                      <div className="flex justify-between border-b border-ocean-700/50 pb-1">
                        <span className="text-ocean-100">Fish</span>
                        <span className="font-medium text-right max-w-[150px] truncate">{setup.fishCapacity}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AquariumVisualizer;
