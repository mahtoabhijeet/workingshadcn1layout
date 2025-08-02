"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, X, MapPin, Clock, Mountain, Ruler, Calendar, Info, Phone, ExternalLink, Star, MessageSquare, Image, Cloud, Wind, Droplets, DollarSign } from 'lucide-react';
import { Article, Trek, MOCK_ARTICLES } from "@/lib/data";

interface DynamicPanelProps {
  activeTab: string;
  onTrekSelect: (trek: Trek) => void;
}

type ViewState = 'list' | 'detail';
type ContentType = 'article' | 'trek';

export default function DynamicPanel({ activeTab, onTrekSelect }: DynamicPanelProps) {
  const [view, setView] = useState<ViewState>('list');
  const [selectedItem, setSelectedItem] = useState<Article | Trek | null>(null);
  const [contentType, setContentType] = useState<ContentType>('article');
  const [history, setHistory] = useState<(Article | Trek)[]>([]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const handleItemClick = (item: Article | Trek, type: ContentType) => {
    setHistory([...history, selectedItem].filter(Boolean) as (Article | Trek)[]);
    setSelectedItem(item);
    setContentType(type);
    setView('detail');
    if (type === 'trek') {
      onTrekSelect(item as Trek);
    }
  };

  const handleBackClick = () => {
    const lastItem = history[history.length - 1];
    setSelectedItem(lastItem);
    setHistory(history.slice(0, -1));
    if (!lastItem) {
      setView('list');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderListView = () => {
    const filteredArticles = MOCK_ARTICLES.filter(article => {
      return true;
    });

    return (
      <>
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
        </div>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>
        <div className="p-4 overflow-y-auto">
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(article, 'article')}>
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{article.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderDetailView = () => {
    if (!selectedItem) return null;

    if (contentType === 'article') {
      const article = selectedItem as Article;
      return (
        <>
          <div className="p-4 border-b flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold capitalize truncate">{article.title}</h2>
          </div>
          <div className="p-4 overflow-y-auto">
            <p className="text-gray-600 mb-6">{article.description}</p>
            <div className="space-y-4">
              {article.treks.map((trek: Trek) => (
                <Card key={trek.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleItemClick(trek, 'trek')}>
                  <CardHeader>
                    <CardTitle>{trek.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{trek.details.duration} | {trek.details.distance} | {trek.details.elevation}</p>
                    <p className={`text-sm font-medium ${
                      trek.difficulty === 'Easy' ? 'text-green-600' :
                      trek.difficulty === 'Moderate' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>Difficulty: {trek.difficulty}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      );
    }

    if (contentType === 'trek') {
      const trek = selectedItem as Trek;
      return (
        <>
          <div className="p-4 border-b flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBackClick} className="mr-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold capitalize truncate">{trek.name}</h2>
          </div>
          <div className="p-4 overflow-y-auto">
            <img src={trek.interactive.photoGallery[0] || '/images/placeholder.jpg'} alt={trek.name} className="w-full h-48 object-cover rounded-lg mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overview</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{trek.name}</p>
                  <p className="text-sm text-muted-foreground">Difficulty: {trek.difficulty}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Location</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Manali Region</p>
                  <p className="text-sm text-muted-foreground">Coordinates: {trek.coordinates[0]}, {trek.coordinates[1]}</p>
                </CardContent>
              </Card>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Trek Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" /> Duration: {trek.details.duration}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Ruler className="w-4 h-4" /> Distance: {trek.details.distance}
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mountain className="w-4 h-4" /> Elevation Gain: {trek.details.elevation}
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="bg-background/80 backdrop-blur-sm h-full flex flex-col border rounded-lg">
      {view === 'list' ? renderListView() : renderDetailView()}
    </div>
  );
}
