"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mountain, 
  Route, 
  MapPin, 
  Users, 
  Info, 
  Clock, 
  TrendingUp,
  Star,
  Calendar,
  User
} from "lucide-react";
import { usePeaks, useTrails, useStories, useExpeditions } from "@/hooks/useSupabase";

interface TabbedBottomPanelProps {
  onItemSelect: (item: any, type: string) => void;
  onMapUpdate: (coordinates: [number, number]) => void;
}

interface ItemCardProps {
  item: any;
  type: string;
  onSelect: (item: any, type: string) => void;
  onMapUpdate: (coordinates: [number, number]) => void;
}

function ItemCard({ item, type, onSelect, onMapUpdate }: ItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Update map when item comes into view
          let coordinates: [number, number] | null = null;
          
          switch (type) {
            case 'peak':
              coordinates = [item.longitude, item.latitude];
              break;
            case 'trail':
              coordinates = [item.start_longitude, item.start_latitude];
              break;
            case 'story':
              if (item.longitude && item.latitude) {
                coordinates = [item.longitude, item.latitude];
              }
              break;
            case 'resource':
              coordinates = [item.longitude, item.latitude];
              break;
          }
          
          if (coordinates) {
            onMapUpdate(coordinates);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [item, type, onMapUpdate]);

  const renderCard = () => {
    switch (type) {
      case 'peak':
        return (
          <Card ref={cardRef} className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelect(item, type)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{item.elevation}m</Badge>
                <Badge 
                  variant={item.difficulty === 'extreme' ? 'destructive' : 
                         item.difficulty === 'hard' ? 'secondary' : 'default'}
                >
                  {item.difficulty}
                </Badge>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>
        );

      case 'trail':
        return (
          <Card ref={cardRef} className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelect(item, type)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{item.distance}km</Badge>
                <Badge 
                  variant={item.difficulty === 'extreme' ? 'destructive' : 
                         item.difficulty === 'hard' ? 'secondary' : 'default'}
                >
                  {item.difficulty}
                </Badge>
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(item.duration / 60)}h {item.duration % 60}m
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{item.elevation_gain}m
                </span>
                {item.peak && <span>🏔️ {item.peak.name}</span>}
              </div>
            </CardContent>
          </Card>
        );

      case 'story':
        return (
          <Card ref={cardRef} className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold">{item.title}</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelect(item, type)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {item.author?.full_name && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.author.full_name}
                  </span>
                )}
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                {item.peak && <span>🏔️ {item.peak.name}</span>}
                {item.trail && <span>🥾 {item.trail.name}</span>}
              </div>
            </CardContent>
          </Card>
        );

      case 'expedition':
        return (
          <Card ref={cardRef} className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelect(item, type)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant={item.status === 'active' ? 'default' : 
                         item.status === 'completed' ? 'secondary' : 'outline'}
                >
                  {item.status}
                </Badge>
                <Badge variant="outline">
                  {item.current_participants}/{item.max_participants}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.start_date).toLocaleDateString()}
                </span>
                {item.organizer?.full_name && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {item.organizer.full_name}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'resource':
        return (
          <Card ref={cardRef} className="mb-3 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSelect(item, type)}
                  className="h-8 w-8 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{item.type}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{item.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>📍 {item.location}</span>
                {item.contact && <span>📞 {item.contact}</span>}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderCard();
}

// Sample resource data
const sampleResources = [
  {
    id: '1',
    name: 'Manali Weather Station',
    type: 'Weather',
    description: 'Real-time weather monitoring for the Manali region with altitude-specific forecasts.',
    location: 'Manali, Himachal Pradesh',
    latitude: 32.2432,
    longitude: 77.1892,
    rating: 4.8,
    contact: '+91-1902-252116'
  },
  {
    id: '2',
    name: 'Himalayan Gear Rental',
    type: 'Equipment',
    description: 'Complete mountaineering and trekking equipment rental with expert guidance.',
    location: 'Mall Road, Manali',
    latitude: 32.2396,
    longitude: 77.1887,
    rating: 4.6,
    contact: '+91-98160-12345'
  },
  {
    id: '3',
    name: 'Mountain Rescue Himachal',
    type: 'Emergency',
    description: '24/7 mountain rescue services covering the entire Himachal Pradesh region.',
    location: 'Shimla (HQ)',
    latitude: 31.1048,
    longitude: 77.1734,
    rating: 4.9,
    contact: '112 (Emergency)'
  },
  {
    id: '4',
    name: 'Sherpa Guide Services',
    type: 'Guides',
    description: 'Experienced local guides for high-altitude expeditions and cultural tours.',
    location: 'Vashisht, Manali',
    latitude: 32.2518,
    longitude: 77.1945,
    rating: 4.7,
    contact: '+91-94180-67890'
  }
];

export default function TabbedBottomPanel({ onItemSelect, onMapUpdate }: TabbedBottomPanelProps) {
  const [activeTab, setActiveTab] = useState("trails");
  const { data: peaks, loading: peaksLoading } = usePeaks();
  const { data: trails, loading: trailsLoading } = useTrails();
  const { data: stories, loading: storiesLoading } = useStories();
  const { data: expeditions, loading: expeditionsLoading } = useExpeditions();

  const isLoading = peaksLoading || trailsLoading || storiesLoading || expeditionsLoading;

  const renderTabContent = (tabType: string) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    let items: any[] = [];
    let type = '';

    switch (tabType) {
      case 'trails':
        items = trails || [];
        type = 'trail';
        break;
      case 'peaks':
        items = peaks || [];
        type = 'peak';
        break;
      case 'resources':
        items = sampleResources;
        type = 'resource';
        break;
      case 'people':
        // Combine stories and expeditions for people tab
        items = [
          ...(stories || []).map(story => ({ ...story, itemType: 'story' })),
          ...(expeditions || []).map(expedition => ({ ...expedition, itemType: 'expedition' }))
        ];
        break;
    }

    return (
      <div className="h-full overflow-y-auto px-4 py-2">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No {tabType} available</p>
          </div>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type={tabType === 'people' ? item.itemType : type}
              onSelect={onItemSelect}
              onMapUpdate={onMapUpdate}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trails" className="flex items-center gap-2">
              <Route className="w-4 h-4" />
              Trails
            </TabsTrigger>
            <TabsTrigger value="peaks" className="flex items-center gap-2">
              <Mountain className="w-4 h-4" />
              Peaks
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="people" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              People
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="trails" className="h-full m-0">
            {renderTabContent('trails')}
          </TabsContent>
          <TabsContent value="peaks" className="h-full m-0">
            {renderTabContent('peaks')}
          </TabsContent>
          <TabsContent value="resources" className="h-full m-0">
            {renderTabContent('resources')}
          </TabsContent>
          <TabsContent value="people" className="h-full m-0">
            {renderTabContent('people')}
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
}
