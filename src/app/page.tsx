"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mountain, Route, Camera, Compass, User, LogIn } from "lucide-react";
import { usePeaks, useTrails, useStories, useExpeditions } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseReady } from "@/lib/supabase";
import MapboxMap from "@/components/MapboxMap";
import DynamicPanel from "@/components/DynamicPanel";
import AdminPanel from "@/components/AdminPanel";
import MapBottomDrawer from "@/components/MapBottomDrawer";
import { Article, Trek, MOCK_ARTICLES } from "@/lib/data";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stories");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [isMapBottomDrawerOpen, setMapBottomDrawerOpen] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { data: peaks } = usePeaks();
  const { data: trails } = useTrails();
  const { data: stories } = useStories();
  const { data: expeditions } = useExpeditions();

  const peakCount = peaks?.length || 0;
  const trailCount = trails?.length || 0;
  const storyCount = stories?.length || 0;
  const expeditionCount = expeditions?.length || 0;

  const supabaseConfigured = isSupabaseReady();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setDrawerOpen(true);
    setSelectedTrek(null);
    setMapBottomDrawerOpen(false);
  };

  const handleTrekSelect = (trek: Trek) => {
    setSelectedTrek(trek);
    setMapBottomDrawerOpen(true);
  };

  const handleMapBottomDrawerClose = () => {
    setMapBottomDrawerOpen(false);
    setSelectedTrek(null);
  };

  // Show configuration message if Supabase is not set up
  if (!supabaseConfigured) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center">
            <Mountain className="w-16 h-16 text-teal-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mountain Explorer</h1>
            <p className="text-gray-600 mb-6">
              Welcome to Mountain Explorer! To get started, you need to configure your Supabase project.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Setup:</h3>
              <ol className="text-sm text-blue-800 text-left space-y-1">
                <li>1. Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a></li>
                <li>2. Update your <code className="bg-blue-100 px-1 rounded">.env.local</code> file with your credentials</li>
                <li>3. Run the database migration in Supabase SQL Editor</li>
                <li>4. Restart the development server</li>
              </ol>
            </div>
            <p className="text-sm text-gray-500">
              See <code className="bg-gray-100 px-1 rounded">SETUP_GUIDE.md</code> for detailed instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-500">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
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
              placeholder="Search peaks, trails, stories..."
              className="pl-10 bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <button
              onClick={() => handleTabClick("trails")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "trails" && isDrawerOpen
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Route className="w-4 h-4" />
              Trails
            </button>
            
            <button
              onClick={() => handleTabClick("peaks")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "peaks" && isDrawerOpen
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Mountain className="w-4 h-4" />
              Peaks
            </button>
            
            <button
              onClick={() => handleTabClick("stories")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "stories" && isDrawerOpen
                  ? "bg-teal-50 text-teal-700 border border-teal-200"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Camera className="w-4 h-4" />
              Stories
            </button>
            
            <button
              onClick={() => handleTabClick("expeditions")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "expeditions" && isDrawerOpen
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
              <div className="text-2xl font-bold text-gray-900">{peakCount}</div>
              <div className="text-sm text-gray-500">Peaks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{trailCount}</div>
              <div className="text-sm text-gray-500">Trails</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{storyCount}</div>
              <div className="text-sm text-gray-500">Stories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{expeditionCount}</div>
              <div className="text-sm text-gray-500">Expeditions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mountain Explorer Map</h1>
              <p className="text-gray-500">
                Interactive map showing {peakCount} peaks, {trailCount} trails, and {storyCount} stories in the Himalayas
              </p>
            </div>
            <div className="flex gap-2">
              {!authLoading && (
                <>
                  {user ? (
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      {user.email}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </>
              )}
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Photos
              </Button>
              <Button variant="outline" size="sm">
                <Route className="w-4 h-4 mr-2" />
                Route Planner
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAdminPanel(true)}>
                Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area - Map */}
        <div className="flex-1 bg-gray-50 flex gap-4">
          <div className={`h-full transition-all duration-300 ${isDrawerOpen ? 'w-3/5' : 'w-full'}`}>
            <MapboxMap selectedTrek={selectedTrek} isBottomDrawerOpen={isMapBottomDrawerOpen} />
          </div>
          {isDrawerOpen && (
            <div className="h-full w-2/5">
              <DynamicPanel
                activeTab={activeTab}
                onTrekSelect={handleTrekSelect}
              />
            </div>
          )}
        <MapBottomDrawer
          isOpen={isMapBottomDrawerOpen}
          trek={selectedTrek}
          onClose={handleMapBottomDrawerClose}
          onTrekSelect={handleTrekSelect}
        />
        </div>
        <AdminPanel show={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
      </div>
    </div>
  );
}
