"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Mountain, Route, MapPin, Camera, Compass, User, LogIn } from "lucide-react";
import { usePeaks, useTrails, useStories, useExpeditions, useSearch } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { isSupabaseReady } from "@/lib/supabase";

export default function Home() {
  const [activeTab, setActiveTab] = useState("stories");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading: authLoading } = useAuth();
  const { data: peaks, loading: peaksLoading } = usePeaks();
  const { data: trails, loading: trailsLoading } = useTrails();
  const { data: stories, loading: storiesLoading } = useStories();
  const { data: expeditions, loading: expeditionsLoading } = useExpeditions();
  const { results: searchResults, loading: searchLoading } = useSearch(searchQuery);

  const peakCount = peaks?.length || 0;
  const trailCount = trails?.length || 0;
  const storyCount = stories?.length || 0;
  const expeditionCount = expeditions?.length || 0;

  const isLoading = peaksLoading || trailsLoading || storiesLoading || expeditionsLoading;
  const supabaseConfigured = isSupabaseReady();

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

  const getTabContent = () => {
    if (searchQuery.trim()) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Search Results for &ldquo;{searchQuery}&rdquo;</h2>
          {searchLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Searching...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {searchResults.peaks.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Peaks ({searchResults.peaks.length})</h3>
                  <div className="space-y-2">
                    {searchResults.peaks.map((peak) => (
                      <div key={peak.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{peak.name}</h4>
                          <Badge variant="outline">{peak.elevation}m</Badge>
                        </div>
                        {peak.description && (
                          <p className="text-sm text-gray-600 mt-1">{peak.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {searchResults.trails.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Trails ({searchResults.trails.length})</h3>
                  <div className="space-y-2">
                    {searchResults.trails.map((trail) => (
                      <div key={trail.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{trail.name}</h4>
                          <Badge variant="outline">{trail.distance}km</Badge>
                        </div>
                        {trail.description && (
                          <p className="text-sm text-gray-600 mt-1">{trail.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.stories.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Stories ({searchResults.stories.length})</h3>
                  <div className="space-y-2">
                    {searchResults.stories.map((story) => (
                      <div key={story.id} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium">{story.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{story.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.expeditions.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Expeditions ({searchResults.expeditions.length})</h3>
                  <div className="space-y-2">
                    {searchResults.expeditions.map((expedition) => (
                      <div key={expedition.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{expedition.name}</h4>
                          <Badge variant="outline">{expedition.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{expedition.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.peaks.length === 0 && 
               searchResults.trails.length === 0 && 
               searchResults.stories.length === 0 && 
               searchResults.expeditions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found for &ldquo;{searchQuery}&rdquo;</p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    switch (activeTab) {
      case "peaks":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mountain Peaks</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading peaks...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {peaks?.map((peak) => (
                  <div key={peak.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{peak.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{peak.elevation}m</Badge>
                        <Badge 
                          variant={peak.difficulty === 'extreme' ? 'destructive' : 
                                 peak.difficulty === 'hard' ? 'secondary' : 'default'}
                        >
                          {peak.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {peak.description && (
                      <p className="text-gray-600 text-sm">{peak.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>📍 {peak.latitude.toFixed(4)}, {peak.longitude.toFixed(4)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "trails":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hiking Trails</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading trails...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trails?.map((trail) => (
                  <div key={trail.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{trail.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{trail.distance}km</Badge>
                        <Badge 
                          variant={trail.difficulty === 'extreme' ? 'destructive' : 
                                 trail.difficulty === 'hard' ? 'secondary' : 'default'}
                        >
                          {trail.difficulty}
                        </Badge>
                      </div>
                    </div>
                    {trail.description && (
                      <p className="text-gray-600 text-sm mb-3">{trail.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {Math.floor(trail.duration / 60)}h {trail.duration % 60}m</span>
                      <span>📈 +{trail.elevation_gain}m</span>
                      {trail.peak && <span>🏔️ {trail.peak.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "stories":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Adventure Stories</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading stories...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stories?.map((story) => (
                  <div key={story.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{story.title}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(story.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{story.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {story.author?.full_name && (
                        <span>👤 {story.author.full_name}</span>
                      )}
                      {story.peak && <span>🏔️ {story.peak.name}</span>}
                      {story.trail && <span>🥾 {story.trail.name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "expeditions":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Expeditions</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading expeditions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expeditions?.map((expedition) => (
                  <div key={expedition.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{expedition.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={expedition.status === 'active' ? 'default' : 
                                 expedition.status === 'completed' ? 'secondary' : 'outline'}
                        >
                          {expedition.status}
                        </Badge>
                        <Badge variant="outline">
                          {expedition.current_participants}/{expedition.max_participants}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{expedition.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {new Date(expedition.start_date).toLocaleDateString()} - {new Date(expedition.end_date).toLocaleDateString()}</span>
                      {expedition.organizer?.full_name && (
                        <span>👤 {expedition.organizer.full_name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
              <p className="text-gray-500">
                {searchQuery.trim() ? `Search results for "${searchQuery}"` : 
                 `Explore ${activeTab === 'stories' ? storyCount : 
                           activeTab === 'peaks' ? peakCount : 
                           activeTab === 'trails' ? trailCount : 
                           expeditionCount} ${activeTab} in the Himalayas`}
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
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {getTabContent()}
        </div>
      </div>
    </div>
  );
}
