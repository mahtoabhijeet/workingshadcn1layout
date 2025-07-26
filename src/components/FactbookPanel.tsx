"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mountain, 
  Route, 
  MapPin, 
  Users, 
  Clock, 
  TrendingUp,
  Star,
  Calendar,
  User,
  Phone,
  Mail,
  Globe,
  Camera,
  Navigation,
  Thermometer,
  Wind,
  Eye
} from "lucide-react";

interface FactbookPanelProps {
  selectedItem: any;
  selectedType: string;
}

export default function FactbookPanel({ selectedItem, selectedType }: FactbookPanelProps) {
  if (!selectedItem) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Mountain Explorer Factbook
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium mb-2">Select an Item</h3>
            <p className="text-sm">
              Click the info button on any trail, peak, resource, or story to view detailed information here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    switch (selectedType) {
      case 'peak':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Mountain className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                <p className="text-gray-600">Mountain Peak</p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{selectedItem.elevation}m</div>
                <div className="text-sm text-gray-500">Elevation</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <Badge 
                  variant={selectedItem.difficulty === 'extreme' ? 'destructive' : 
                         selectedItem.difficulty === 'hard' ? 'secondary' : 'default'}
                  className="text-sm"
                >
                  {selectedItem.difficulty}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">Difficulty</div>
              </div>
            </div>

            {/* Description */}
            {selectedItem.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.description}</p>
              </div>
            )}

            {/* Location */}
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation className="w-4 h-4" />
                <span>{selectedItem.latitude.toFixed(6)}, {selectedItem.longitude.toFixed(6)}</span>
              </div>
            </div>

            {/* Weather Info */}
            <div>
              <h3 className="font-semibold mb-2">Current Conditions</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="w-4 h-4 text-blue-500" />
                  <span>-12°C</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span>45 km/h</span>
                </div>
              </div>
            </div>

            {/* Climbing Routes */}
            <div>
              <h3 className="font-semibold mb-2">Popular Routes</h3>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">Standard Route</div>
                  <div className="text-xs text-gray-500">Most common climbing path</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">Technical Route</div>
                  <div className="text-xs text-gray-500">For experienced climbers</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trail':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Route className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                <p className="text-gray-600">Hiking Trail</p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">{selectedItem.distance}km</div>
                <div className="text-sm text-gray-500">Distance</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.floor(selectedItem.duration / 60)}h {selectedItem.duration % 60}m
                </div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">+{selectedItem.elevation_gain}m</div>
                <div className="text-sm text-gray-500">Elevation Gain</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <Badge 
                  variant={selectedItem.difficulty === 'extreme' ? 'destructive' : 
                         selectedItem.difficulty === 'hard' ? 'secondary' : 'default'}
                  className="text-sm"
                >
                  {selectedItem.difficulty}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">Difficulty</div>
              </div>
            </div>

            {/* Description */}
            {selectedItem.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.description}</p>
              </div>
            )}

            {/* Route Details */}
            <div>
              <h3 className="font-semibold mb-2">Route Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>Start: {selectedItem.start_latitude.toFixed(4)}, {selectedItem.start_longitude.toFixed(4)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>End: {selectedItem.end_latitude.toFixed(4)}, {selectedItem.end_longitude.toFixed(4)}</span>
                </div>
              </div>
            </div>

            {/* Connected Peak */}
            {selectedItem.peak && (
              <div>
                <h3 className="font-semibold mb-2">Destination Peak</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-teal-600" />
                    <span className="font-medium">{selectedItem.peak.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedItem.peak.elevation}m elevation
                  </div>
                </div>
              </div>
            )}

            {/* Trail Conditions */}
            <div>
              <h3 className="font-semibold mb-2">Current Conditions</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Trail Status</span>
                  <Badge variant="default">Open</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Weather</span>
                  <span className="text-gray-600">Clear</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Best Season</span>
                  <span className="text-gray-600">Apr - Oct</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'resource':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                <p className="text-gray-600">{selectedItem.type}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedItem.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <span className="font-medium">{selectedItem.rating}</span>
              <span className="text-sm text-gray-500">(Based on user reviews)</span>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedItem.location}</span>
                </div>
                {selectedItem.contact && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{selectedItem.contact}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold mb-2">Services</h3>
              <div className="space-y-2">
                {selectedItem.type === 'Equipment' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Trekking Gear</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Climbing Equipment</span>
                      <Badge variant="outline">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Winter Gear</span>
                      <Badge variant="outline">Seasonal</Badge>
                    </div>
                  </>
                )}
                {selectedItem.type === 'Weather' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Real-time Data</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Forecasts</span>
                      <Badge variant="default">7-day</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Altitude Coverage</span>
                      <Badge variant="outline">Up to 6000m</Badge>
                    </div>
                  </>
                )}
                {selectedItem.type === 'Emergency' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Response Time</span>
                      <Badge variant="destructive">&lt; 2 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Helicopter Rescue</span>
                      <Badge variant="default">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Medical Support</span>
                      <Badge variant="default">24/7</Badge>
                    </div>
                  </>
                )}
                {selectedItem.type === 'Guides' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span>Experience</span>
                      <Badge variant="default">15+ years</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Languages</span>
                      <Badge variant="outline">Hindi, English</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Certification</span>
                      <Badge variant="default">UIAGM</Badge>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold mb-2">Location</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Navigation className="w-4 h-4" />
                <span>{selectedItem.latitude.toFixed(6)}, {selectedItem.longitude.toFixed(6)}</span>
              </div>
            </div>
          </div>
        );

      case 'story':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Camera className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
                <p className="text-gray-600">Adventure Story</p>
              </div>
            </div>

            {/* Author Info */}
            {selectedItem.author?.full_name && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <div className="font-medium">{selectedItem.author.full_name}</div>
                  <div className="text-sm text-gray-500">Adventure Author</div>
                </div>
              </div>
            )}

            {/* Story Content */}
            <div>
              <h3 className="font-semibold mb-2">Story</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 leading-relaxed">{selectedItem.content}</p>
              </div>
            </div>

            {/* Related Locations */}
            <div>
              <h3 className="font-semibold mb-2">Related Locations</h3>
              <div className="space-y-2">
                {selectedItem.peak && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Mountain className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium">{selectedItem.peak.name}</span>
                  </div>
                )}
                {selectedItem.trail && (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Route className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-medium">{selectedItem.trail.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Story Details */}
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Published</span>
                  <span className="text-gray-600">
                    {new Date(selectedItem.created_at).toLocaleDateString()}
                  </span>
                </div>
                {selectedItem.latitude && selectedItem.longitude && (
                  <div className="flex items-center justify-between text-sm">
                    <span>Location</span>
                    <span className="text-gray-600">
                      {selectedItem.latitude.toFixed(4)}, {selectedItem.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'expedition':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
                <p className="text-gray-600">Group Expedition</p>
              </div>
            </div>

            {/* Status and Participants */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <Badge 
                  variant={selectedItem.status === 'active' ? 'default' : 
                         selectedItem.status === 'completed' ? 'secondary' : 'outline'}
                  className="text-sm"
                >
                  {selectedItem.status}
                </Badge>
                <div className="text-sm text-gray-500 mt-1">Status</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-900">
                  {selectedItem.current_participants}/{selectedItem.max_participants}
                </div>
                <div className="text-sm text-gray-500">Participants</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{selectedItem.description}</p>
            </div>

            {/* Organizer */}
            {selectedItem.organizer?.full_name && (
              <div>
                <h3 className="font-semibold mb-2">Organizer</h3>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedItem.organizer.full_name}</div>
                    <div className="text-sm text-gray-500">Expedition Leader</div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule */}
            <div>
              <h3 className="font-semibold mb-2">Schedule</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span>Start: {new Date(selectedItem.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>End: {new Date(selectedItem.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>
                    Duration: {Math.ceil(
                      (new Date(selectedItem.end_date).getTime() - new Date(selectedItem.start_date).getTime()) 
                      / (1000 * 60 * 60 * 24)
                    )} days
                  </span>
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h3 className="font-semibold mb-2">Difficulty Level</h3>
              <Badge 
                variant={selectedItem.difficulty === 'extreme' ? 'destructive' : 
                       selectedItem.difficulty === 'hard' ? 'secondary' : 'default'}
                className="text-sm"
              >
                {selectedItem.difficulty}
              </Badge>
            </div>

            {/* Join Button */}
            {selectedItem.status === 'planning' && selectedItem.current_participants < selectedItem.max_participants && (
              <div>
                <Button className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Join Expedition
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <p>Unknown item type</p>
          </div>
        );
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Factbook
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
