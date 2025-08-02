"use client";

import { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, ViewStateChangeEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Trek, MOCK_ARTICLES } from '@/lib/data';

// Manali coordinates
const MANALI_COORDINATES: [number, number] = [77.1892, 32.2432];

interface MapboxMapProps {
  className?: string;
  selectedTrek: Trek | null;
  isBottomDrawerOpen: boolean;
}

export default function MapboxMap({ className = '', selectedTrek, isBottomDrawerOpen }: MapboxMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [viewState, setViewState] = useState({
    longitude: MANALI_COORDINATES[0],
    latitude: MANALI_COORDINATES[1],
    zoom: 12,
    pitch: 45,
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
  }, [mapRef.current]); // Dependency on mapRef.current to ensure map is loaded

  const allTreks = MOCK_ARTICLES.flatMap(article => article.treks);

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${className} ${isBottomDrawerOpen ? 'h-2/3' : 'h-full'}`} style={{ minHeight: '400px' }}>
      <Map
        ref={(instance) => {
          if (instance) {
            mapRef.current = instance.getMap();
          }
        }}
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        terrain={{ source: 'mapbox-dem', exaggeration: 1.0 }} // Enable 3D terrain
        onLoad={(map) => {
          map.target.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          // add the DEM source as a terrain layer with exaggerated height
          map.target.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          startRotation(); // Start rotation after map is fully loaded
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
    </div>
  );
}
