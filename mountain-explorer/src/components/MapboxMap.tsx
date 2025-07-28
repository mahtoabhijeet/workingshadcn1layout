"use client";

import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppStore } from '@/lib/store';

// Manali coordinates
const MANALI_COORDINATES: [number, number] = [77.1892, 32.2432];

interface MapboxMapProps {
  className?: string;
}

export default function MapboxMap({ className = '' }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapCenter = useAppStore((state) => state.mapCenter);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Set the access token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    // Initialize the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // Satellite style
      center: MANALI_COORDINATES,
      zoom: 12,
      pitch: 45, // Add some tilt for a more dynamic view
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left');

    // Set map loaded state
    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add a marker for Manali
    new mapboxgl.Marker({
      color: '#0d9488', // Teal color to match your theme
      scale: 1.2
    })
      .setLngLat(MANALI_COORDINATES)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3 style="margin: 0; color: #0d9488;">Manali</h3><p style="margin: 5px 0 0 0; font-size: 14px;">Gateway to the Himalayas</p>')
      )
      .addTo(map.current);

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle map resize when container size changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      const resizeObserver = new ResizeObserver(() => {
        map.current?.resize();
      });

      if (mapContainer.current) {
        resizeObserver.observe(mapContainer.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [mapLoaded]);

  // Animate map to new center when global state changes
  useEffect(() => {
    if (map.current && mapCenter) {
      map.current.flyTo({
        center: mapCenter,
        zoom: 14,
        essential: true,
      });
    }
  }, [mapCenter]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}