"use client";

import { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, ViewStateChangeEvent, MapRef } from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { Trek, MOCK_ARTICLES } from '@/lib/data';
import MapCameraAPI from '@/lib/map-camera-api/MapCameraAPI';

// Manali coordinates
const MANALI_COORDINATES: [number, number] = [77.1892, 32.2432];

interface MapLibreMapProps {
  className?: string;
  selectedTrek: Trek | null;
}

export default function MapLibreMap({ className = '', selectedTrek }: MapLibreMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const cameraApiRef = useRef<MapCameraAPI | null>(null);
  const [viewState, setViewState] = useState({
    longitude: MANALI_COORDINATES[0],
    latitude: MANALI_COORDINATES[1],
    zoom: 12,
    pitch: 90, // Default to 2D view
    bearing: 0
  });
  const [showPopup, setShowPopup] = useState(true);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (selectedTrek && mapRef.current) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      mapRef.current.flyTo({
        center: selectedTrek.coordinates,
        zoom: 14,
        pitch: 45,
        duration: 3000,
        essential: true,
      });
      setShowPopup(false); // Hide initial popup when a trek is selected
    } else if (!selectedTrek && mapRef.current) {
      setShowPopup(true);
      // Restart animation if no trek is selected and map is ready
      if (!animationFrameId.current) {
        startRotation();
      }
    }
  }, [selectedTrek]);

  const startRotation = () => {
    if (!mapRef.current) return;

    let lastFrameTime = performance.now();
    const rotateCamera = (timestamp: DOMHighResTimeStamp) => {
      if (!mapRef.current) return;

      const deltaTime = timestamp - lastFrameTime;
      lastFrameTime = timestamp;

      const currentBearing = mapRef.current.getBearing();
      const newBearing = (currentBearing + (0.0001 * deltaTime)) % 360; // Rotate slowly
      const currentPitch = mapRef.current.getPitch();
      const newPitch = 45 + 15 * Math.sin(timestamp / 2000); // Oscillate pitch between 30 and 60

      mapRef.current.easeTo({ bearing: newBearing, pitch: newPitch, duration: 0, easing: (t) => t });
      animationFrameId.current = requestAnimationFrame(rotateCamera);
    };

    animationFrameId.current = requestAnimationFrame(rotateCamera);
  };

  useEffect(() => {
    // Start rotation when the component mounts and map is ready
    if (mapRef.current && !selectedTrek) {
      startRotation();
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mapRef.current, selectedTrek]); // Dependency on mapRef.current to ensure map is loaded

  useEffect(() => {
    if (cameraApiRef.current) {
      const toolboxContainer = document.getElementById('map-toolbox');
      if (toolboxContainer) {
        cameraApiRef.current.generateToolbox(toolboxContainer);
      }
    }
  }, [cameraApiRef.current]);

  const allTreks = MOCK_ARTICLES.flatMap(article => article.treks);

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`} style={{ minHeight: '400px' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapLib={maplibregl}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onLoad={() => {
          if (mapRef.current) {
            startRotation(); // Start rotation after map is fully loaded
            cameraApiRef.current = new MapCameraAPI(mapRef);
          }
        }}
      >
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />
        <ScaleControl />

        {/* Main Manali Marker */}
        <Marker
          longitude={MANALI_COORDINATES[0]}
          latitude={MANALI_COORDINATES[1]}
          color="#0d9488"
        />

        {showPopup && (
          <Popup
            longitude={MANALI_COORDINATES[0]}
            latitude={MANALI_COORDINATES[1]}
            anchor="bottom"
            onClose={() => setShowPopup(false)}
            offset={25}
          >
            <div style={{ color: '#0d9488', padding: '5px' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold' }}>Manali</h3>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Gateway to the Himalayas</p>
            </div>
          </Popup>
        )}

        {/* Trek Markers */}
        {allTreks.map(trek => (
          <Marker
            key={trek.id}
            longitude={trek.coordinates[0]}
            latitude={trek.coordinates[1]}
            color={selectedTrek?.id === trek.id ? '#ff0000' : '#007bff'} // Highlight selected trek
          >
            {selectedTrek?.id === trek.id && (
              <Popup
                longitude={trek.coordinates[0]}
                latitude={trek.coordinates[1]}
                anchor="bottom"
                offset={25}
                closeButton={false}
                closeOnClick={false}
              >
                <div style={{ color: '#007bff', padding: '5px' }}>
                  <h3 style={{ margin: 0, fontWeight: 'bold' }}>{trek.name}</h3>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </Map>
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
        <button
          onClick={() => {
            if (cameraApiRef.current) {
              // Example: Fly to a random trek
              const randomTrek = MOCK_ARTICLES[0].treks[Math.floor(Math.random() * MOCK_ARTICLES[0].treks.length)];
              cameraApiRef.current.flyToLocation(randomTrek.coordinates, { zoom: 15, pitch: 60 });
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Fly to Random Trek
        </button>
        <button
          onClick={() => {
            if (cameraApiRef.current) {
              // Example: Follow a mock path
              const mockPath: GeoJSON.Feature<GeoJSON.LineString> = {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [77.1892, 32.2432],
                    [77.1700, 32.2550],
                    [77.1650, 32.2600],
                  ],
                },
              };
              cameraApiRef.current.followPath(mockPath, { speed: 2 });
            }
          }}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Follow Mock Path
        </button>
        <button
          onClick={() => {
            if (cameraApiRef.current) {
              // Example: Create and apply a camera preset
              cameraApiRef.current.createCameraPresets({
                'birds-eye': { zoom: 16, pitch: 60, bearing: 0 },
              });
              cameraApiRef.current.applyCameraPreset('birds-eye');
            }
          }}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          {`Apply 'Birds Eye' Preset`}
        </button>
        <button
          onClick={() => {
            if (cameraApiRef.current) {
              cameraApiRef.current.enableGestureNavigation();
            }
          }}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Enable Gestures
        </button>
        <button
          onClick={() => {
            if (cameraApiRef.current) {
              cameraApiRef.current.addClickHandlers('flyTo', { zoom: 14, pitch: 45 });
            }
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
        >
          Enable Click to Fly
        </button>
      </div>
      <div id="map-toolbox" className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md flex flex-col space-y-2">
        <button
          onClick={() => cameraApiRef.current?.switchMapStyle('https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Streets
        </button>
      </div>
    </div>
  );
}
