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
import { usePanelContent } from "@/hooks/useSupabase";
import { useAppStore } from "@/lib/store";

interface TabbedBottomPanelProps {
  onItemSelect: (item: any, type: string) => void;
}

interface ItemCardProps {
  item: any;
  type: string;
  onSelect: (item: any, type: string) => void;
}

function ItemCard({ item, type, onSelect }: ItemCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const setMapCenter = useAppStore((state) => state.setMapCenter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Update map when item comes into view
          let coordinates: [number, number] | null = null;
          
          if (item.content && typeof item.content === 'object' && 'longitude' in item.content && 'latitude' in item.content) {
            coordinates = [item.content.longitude, item.content.latitude];
          }
          
          if (coordinates) {
            setMapCenter(coordinates);
          }
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [item, type, setMapCenter]);

  return (
    <Card ref={cardRef} className="mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{item.title}</h3>
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
        {item.image_url && (
          <img src={item.image_url} alt={item.title} className="w-full h-32 object-cover rounded-md mb-2" />
        )}
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function TabbedBottomPanel({ onItemSelect }: TabbedBottomPanelProps) {
  const [activeTab, setActiveTab] = useState("trails");
  const { data: tabContent, loading: contentLoading } = usePanelContent(activeTab);

  const renderTabContent = (tabType: string) => {
    if (contentLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto px-4 py-2">
        {tabContent?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No content available for this tab.</p>
            <p className="text-xs mt-2">Try adding some in the admin panel!</p>
          </div>
        ) : (
          tabContent?.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              type={item.tab_name}
              onSelect={onItemSelect}
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