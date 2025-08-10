import React from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapRef } from 'react-map-gl/mapbox';
import * as turf from '@turf/turf';

interface CameraOptions {
  pitch?: number;
  bearing?: number;
  zoom?: number;
  speed?: number; // For path following
  duration?: number; // For flyTo
  curve?: number; // For flyTo
}

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

class MapCameraAPI {
  private mapRef: React.RefObject<MapRef | null>;
  private mapboxMap: mapboxgl.Map | null = null;
  private cameraPresets: { [key: string]: CameraOptions } = {};
  private _is3DTerrainActive: boolean = false; // Track 3D terrain state

  constructor(mapRef: React.RefObject<MapRef | null>) {
    this.mapRef = mapRef;
  }

  private getMapboxMap(): mapboxgl.Map {
    if (!this.mapRef.current) {
      throw new Error("Map reference is not available.");
    }
    const map = this.mapRef.current.getMap();
    if (!map) {
      throw new Error("Mapbox GL Map instance is not available.");
    }
    this.mapboxMap = map;
    return map;
  }

  // Method to fly to a specific location
  public flyToLocation(coordinates: [number, number], options?: CameraOptions) {
    try {
      const map = this.getMapboxMap();
      map.flyTo({
        center: coordinates,
        zoom: options?.zoom || map.getZoom(),
        pitch: options?.pitch || map.getPitch(),
        bearing: options?.bearing || map.getBearing(),
        duration: options?.duration || 3000,
        curve: options?.curve || 1.42,
        essential: true,
      });
    } catch (error) {
      console.error("Error flying to location:", error);
    }
  }

  // Method to follow a GeoJSON or GPX path
  public followPath(pathData: GeoJSON.Feature<GeoJSON.LineString>, options?: CameraOptions) {
    try {
      const map = this.getMapboxMap();
      const { speed = 1, pitch = 45, bearing = 0 } = options || {};
      const path = pathData.geometry.coordinates;
      const line = turf.lineString(path);
      const totalDistance = turf.length(line, { units: 'kilometers' });

      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const distanceCovered = (elapsedTime / 1000) * (speed * 10); // speed in km/h
        const fraction = distanceCovered / totalDistance;

        if (fraction < 1) {
          const point = turf.along(line, distanceCovered, { units: 'kilometers' });
          const [longitude, latitude] = point.geometry.coordinates;
          map.setCenter([longitude, latitude]);
          map.setPitch(pitch);
          map.setBearing(bearing);
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } catch (error) {
      console.error("Error following path:", error);
    }
  }

  // Method to create camera presets
  public createCameraPresets(templates: { [key: string]: CameraOptions }) {
    this.cameraPresets = { ...this.cameraPresets, ...templates };
  }

  // Method to apply a camera preset
  public applyCameraPreset(presetName: string) {
    const preset = this.cameraPresets[presetName];
    if (preset) {
      try {
        const map = this.getMapboxMap();
        map.flyTo({
          zoom: preset.zoom || map.getZoom(),
          pitch: preset.pitch || map.getPitch(),
          bearing: preset.bearing || map.getBearing(),
          duration: preset.duration || 3000,
          curve: preset.curve || 1.42,
          essential: true,
        });
      } catch (error) {
        console.error(`Error applying preset ${presetName}:`, error);
      }
    } else {
      console.warn(`Preset ${presetName} not found.`);
    }
  }

  // Method to enable gesture navigation
  public enableGestureNavigation() {
    try {
      const map = this.getMapboxMap();
      map.dragRotate.enable();
      map.touchZoomRotate.enable();
      map.touchPitch.enable();
    } catch (error) {
      console.error("Error enabling gesture navigation:", error);
    }
  }

  // Method to add click handlers for map interactions
  public addClickHandlers(type: 'flyTo', options?: CameraOptions) {
    try {
      const map = this.getMapboxMap();
      if (type === 'flyTo') {
        map.on('click', (e) => {
          this.flyToLocation([e.lngLat.lng, e.lngLat.lat], options);
        });
      }
    } catch (error) {
      console.error("Error adding click handlers:", error);
    }
  }

  // Method to add Intersection Observer for scroll-triggered animations
  public addIntersectionObserver(selector: string, options: IntersectionObserverOptions) {
    try {
      const map = this.getMapboxMap();
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // TODO: Define what animation to trigger based on the element
            console.log(`Element ${selector} is intersecting. Triggering animation.`);
            // Example: Fly to a specific location or apply a preset
            // this.flyToLocation([77.1700, 32.2550], { zoom: 14, pitch: 45 });
          }
        });
      }, options);

      const elements = document.querySelectorAll(selector);
      elements.forEach(el => observer.observe(el));

      return () => {
        elements.forEach(el => observer.unobserve(el));
      };
    } catch (error) {
      console.error("Error adding Intersection Observer:", error);
    }
  }

  // Method to switch map styles
  public switchMapStyle(styleUrl: string) {
    try {
      const map = this.getMapboxMap();
      map.setStyle(styleUrl);

      // Listen for style.load event to re-apply terrain if active
      map.once('style.load', () => {
        map.once('render', () => { // Wait for the first render after style load
          if (this._is3DTerrainActive) {
            // Re-add source if it was removed by the new style
            if (!map.getSource('mapbox-dem')) {
              map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
              });
            }
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
            // Optionally, re-adjust pitch if needed, but toggle3DTerrain already handles it.
            // map.easeTo({ pitch: 45, duration: 0 });
          }
        });
      });

    } catch (error) {
      console.error("Error switching map style:", error);
    }
  }

  // Method to toggle 3D terrain and adjust camera pitch
  public toggle3DTerrain(enable: boolean) {
    try {
      const map = this.getMapboxMap();
      this._is3DTerrainActive = enable; // Update internal state

      // Ensure the source exists before setting terrain
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
      }

      if (enable) {
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        map.easeTo({ pitch: 45, duration: 1000 }); // Default 3D pitch
      } else {
        map.setTerrain(null); // Disable terrain
        map.easeTo({ pitch: 90, duration: 1000 }); // 2D pitch
      }
    } catch (error) {
      console.error("Error toggling 3D terrain:", error);
    }
  }

  // Method to generate a basic UI toolbox
  public generateToolbox(containerElement: HTMLElement) {
    // Basic example of generating a simple button in the container
    const styleToggleButton = document.createElement('button');
    styleToggleButton.textContent = 'Toggle Map Style';
    styleToggleButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
    styleToggleButton.onclick = () => {
      // Example: Toggle between two map styles
      const currentStyle = this.getMapboxMap().getStyle().name;
      if (currentStyle === 'Satellite') { // Assuming 'Satellite' is the name of mapbox://styles/mapbox/satellite-v9
        this.switchMapStyle('mapbox://styles/mapbox/streets-v12');
      } else {
        this.switchMapStyle('mapbox://styles/mapbox/satellite-v9');
      }
    };
    containerElement.appendChild(styleToggleButton);

    const terrainToggleButton = document.createElement('button');
    terrainToggleButton.textContent = 'Toggle 3D Terrain';
    terrainToggleButton.className = 'bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-2';
    terrainToggleButton.onclick = () => {
      const map = this.getMapboxMap();
      const currentTerrain = map.getTerrain();
      this.toggle3DTerrain(!currentTerrain);
    };
    containerElement.appendChild(terrainToggleButton);
  }
}

export default MapCameraAPI;
