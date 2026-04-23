import React, { useState } from 'react';
import { Camera, Square, Move3d } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';

const AquariumVisualizer = () => {
  const [scanningState, setScanningState] = useState('initial');
  const [dimensions, setDimensions] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Simulate space detection
  const detectSpace = () => {
    setScanningState('scanning');
    setTimeout(() => {
      setScanningState('detected');
      setDimensions({
        width: 120,
        height: 60,
        depth: 45
      });
    }, 2000);
  };

  // Generate aquarium recommendation
  const generateSetup = () => {
    setShowPreview(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-gray-100 rounded-lg p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">AR Aquarium Visualizer</h2>
          <Camera className="w-8 h-8 text-blue-500" />
        </div>

        {/* Camera Preview / Space Detection */}
        <div className="relative aspect-video bg-gray-200 rounded-lg mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            {scanningState === 'initial' && (
              <button
                onClick={detectSpace}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Scan Space
              </button>
            )}
            
            {scanningState === 'scanning' && (
              <div className="text-gray-600 flex items-center gap-2">
                <Move3d className="w-6 h-6 animate-spin" />
                Scanning available space...
              </div>
            )}

            {scanningState === 'detected' && !showPreview && (
              <div className="text-center">
                <div className="mb-2 text-gray-700">
                  Space Detected: {dimensions.width}cm × {dimensions.height}cm × {dimensions.depth}cm
                </div>
                <button
                  onClick={generateSetup}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Generate Aquarium Setup
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Aquarium Preview */}
        {showPreview && (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Recommended Aquarium Setup</AlertTitle>
              <AlertDescription>
                <div className="space-y-2">
                  <p>Based on the detected space ({dimensions.width}cm × {dimensions.height}cm × {dimensions.depth}cm), here's your recommended setup:</p>
                  <ul className="list-disc pl-4">
                    <li>Tank Size: 100L (90cm × 45cm × 45cm)</li>
                    <li>Lighting: LED strip with adjustable spectrum</li>
                    <li>Filtration: Canister filter rated for 200L/hour</li>
                    <li>Substrate: Fine gravel (2-3cm depth)</li>
                    <li>Plants: Low-light species (Anubias, Java Fern)</li>
                    <li>Fish Capacity: 15-20 small tropical fish</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setScanningState('initial');
                  setShowPreview(false);
                  setDimensions(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Scan New Space
              </button>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Save Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AquariumVisualizer;
