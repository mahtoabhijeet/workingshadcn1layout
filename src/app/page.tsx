"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mountain, Route, MapPin, Camera, Compass } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stories");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <Mountain className="w-6 h-6 text-teal-600" />
            <div>
              <h1 className="font-semibold text-gray-900">Mountain</h1>
              <p className="text-sm text-gray-500">Explorer</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search locations..." 
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("trails")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "trails" 
                  ? "bg-teal-50 text-teal-700 border border-teal-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Route className="w-4 h-4" />
              Trails
            </button>
            
            <button
              onClick={() => setActiveTab("peaks")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "peaks" 
                  ? "bg-teal-50 text-teal-700 border border-teal-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Mountain className="w-4 h-4" />
              Peaks
            </button>
            
            <button
              onClick={() => setActiveTab("stories")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "stories" 
                  ? "bg-teal-50 text-teal-700 border border-teal-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Camera className="w-4 h-4" />
              Stories
            </button>
            
            <button
              onClick={() => setActiveTab("expeditions")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "expeditions" 
                  ? "bg-teal-50 text-teal-700 border border-teal-200" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Compass className="w-4 h-4" />
              Expeditions
            </button>
          </div>
        </nav>

        {/* Stats */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-500">Peaks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-500">Trails</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
              <p className="text-gray-500">Explore 4 stories in the Himalayas</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Photos
              </Button>
              <Button variant="outline" size="sm">
                <Route className="w-4 h-4 mr-2" />
                Route Planner
              </Button>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-gradient-to-br from-teal-50 to-blue-50">
          {/* Map Container */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 to-blue-100/30">
            {/* Map Markers */}
            <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-white/80 rounded-full shadow-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-white/80 rounded-full shadow-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/80 rounded-full shadow-lg flex items-center justify-center">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Map Attribution */}
          <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs text-gray-600">
            © Mountain Explorer
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/90">
              +
            </Button>
            <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/90">
              -
            </Button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <p className="text-gray-500 text-center">Select a location on the map to view details</p>
        </div>
      </div>
    </div>
  );
}
