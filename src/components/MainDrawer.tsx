"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, MapPin, Clock, Mountain, Ruler, Calendar, Info, Phone, ExternalLink, Star, MessageSquare, Image, Cloud, Wind, Droplets, DollarSign } from 'lucide-react';
import { Article, Trek, BookingLink, Review, WeatherData, MOCK_ARTICLES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onTrekSelect: (trek: Trek) => void;
}

type DrawerState = 'articleDetail' | 'trekDetail' | 'challengingTreks';

export default function MainDrawer({ isOpen, onClose, article, onTrekSelect }: MainDrawerProps) {
  const [drawerState, setDrawerState] = useState<DrawerState>('articleDetail');
  const [selectedTrek, setSelectedTrek] = useState<Trek | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDrawerState('articleDetail');
      setSelectedTrek(null);
      setExpandedSections({});
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background content
    } else {
      document.body.style.overflow = '';
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleTrekClick = (trek: Trek) => {
    setSelectedTrek(trek);
    setDrawerState('trekDetail');
    onTrekSelect(trek); // Notify parent to update map and open bottom drawer
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!isOpen) return null;

  const portalRoot = document.getElementById('portal-root') || document.body;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end animate-in fade-in-0">
      <div
        ref={drawerRef}
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white shadow-lg flex flex-col animate-in slide-in-from-right-full duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent click outside from closing when clicking inside
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          {drawerState === 'trekDetail' && (
            <Button variant="ghost" size="icon" onClick={() => setDrawerState('articleDetail')} className="mr-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <h2 className="text-2xl font-bold capitalize flex-1">
            {drawerState === 'articleDetail' ? article?.title : selectedTrek?.name}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {drawerState === 'articleDetail' && article && (
            <div>
              <p className="text-gray-600 mb-6">{article.description}</p>
              {article.treks.length > 0 ? (
                <div className="space-y-4">
                  {['Easy', 'Moderate', 'Hard'].map(difficulty => {
                    const treksByDifficulty = article.treks.filter(t => t.difficulty === difficulty);
                    if (treksByDifficulty.length === 0) return null;
                    return (
                      <div key={difficulty}>
                        <h3 className="text-xl font-semibold mb-3">{difficulty} Treks</h3>
                        <div className="grid gap-4">
                          {treksByDifficulty.map(trek => (
                            <Card key={trek.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTrekClick(trek)}>
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
                    );
                  })}
                  <Button onClick={() => setDrawerState('challengingTreks')}>View Challenging Treks</Button>
                </div>
              ) : (
                <p className="text-gray-500">No treks available for this article.</p>
              )}
            </div>
          )}

          {drawerState === 'challengingTreks' && (
            <div>
              <Button variant="ghost" size="icon" onClick={() => setDrawerState('articleDetail')} className="mr-2">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-xl font-semibold mb-3">Challenging Treks</h3>
              <div className="space-y-4">
                {MOCK_ARTICLES.flatMap(article => article.treks)
                  .filter(trek => trek.difficulty === 'Hard' || trek.difficulty === 'Moderate')
                  .map(trek => (
                    <Card key={trek.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTrekClick(trek)}>
                      <CardHeader>
                        <CardTitle>{trek.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{trek.details.duration} | {trek.details.distance} | {trek.details.elevation}</p>
                        <p className={`text-sm font-medium ${
                          trek.difficulty === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                        }`}>Difficulty: {trek.difficulty}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {drawerState === 'trekDetail' && selectedTrek && (
            <div>
              <img src={selectedTrek.interactive.photoGallery[0] || '/images/placeholder.jpg'} alt={selectedTrek.name} className="w-full h-48 object-cover rounded-lg mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overview</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedTrek.name}</p>
                    <p className="text-sm text-muted-foreground">Difficulty: {selectedTrek.difficulty}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Location</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">Manali Region</p>
                    <p className="text-sm text-muted-foreground">Coordinates: {selectedTrek.coordinates[0]}, {selectedTrek.coordinates[1]}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Details Section */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Trek Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" /> Duration: {selectedTrek.details.duration}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Ruler className="w-4 h-4" /> Distance: {selectedTrek.details.distance}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mountain className="w-4 h-4" /> Elevation Gain: {selectedTrek.details.elevation}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" /> Best Season: {selectedTrek.details.bestSeason}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" /> Starting Point: {selectedTrek.details.startingPoint}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Info className="w-4 h-4" /> Permits Required: {selectedTrek.details.permitsRequired ? 'Yes' : 'No'}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" /> Emergency Contact: {selectedTrek.details.emergencyContact}
                  </div>
                </div>
              </div>

              {/* Interactive Sections */}
              <div className="space-y-6">
                {/* Photo Gallery */}
                {selectedTrek.interactive.photoGallery.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleSection('photoGallery')}>
                      <CardTitle>Photo Gallery</CardTitle>
                      <Image className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    {expandedSections.photoGallery && (
                      <CardContent className="grid grid-cols-2 gap-4">
                        {selectedTrek.interactive.photoGallery.map((img, index) => (
                          <img key={index} src={img} alt={`Trek photo ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                        ))}
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Weather Forecast */}
                {selectedTrek.interactive.weatherForecast && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleSection('weatherForecast')}>
                      <CardTitle>Weather Forecast</CardTitle>
                      <Cloud className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    {expandedSections.weatherForecast && (
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Temperature:</span> {selectedTrek.interactive.weatherForecast.temperature.min}°{selectedTrek.interactive.weatherForecast.temperature.unit} - {selectedTrek.interactive.weatherForecast.temperature.max}°{selectedTrek.interactive.weatherForecast.temperature.unit}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">Conditions:</span> {selectedTrek.interactive.weatherForecast.conditions}
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4" /> <span className="font-semibold">Wind Speed:</span> {selectedTrek.interactive.weatherForecast.windSpeed.value} {selectedTrek.interactive.weatherForecast.windSpeed.unit}
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4" /> <span className="font-semibold">Precipitation Chance:</span> {selectedTrek.interactive.weatherForecast.precipitation.chance}%
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Booking Links */}
                {selectedTrek.interactive.bookingLinks.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleSection('bookingLinks')}>
                      <CardTitle>Booking Options</CardTitle>
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    {expandedSections.bookingLinks && (
                      <CardContent className="space-y-2">
                        {selectedTrek.interactive.bookingLinks.map((link, index) => (
                          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                            <ExternalLink className="w-4 h-4" /> {link.provider} {link.price && `(${link.price})`}
                          </a>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Similar Treks */}
                {selectedTrek.interactive.similarTreks.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleSection('similarTreks')}>
                      <CardTitle>Similar Treks</CardTitle>
                      <Mountain className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    {expandedSections.similarTreks && (
                      <CardContent className="space-y-2">
                        {selectedTrek.interactive.similarTreks.map((trekId, index) => {
                          // Find the trek by ID from MOCK_ARTICLES
                          const similarTrek = MOCK_ARTICLES.flatMap(article => article.treks).find(t => t.id === trekId);
                          return similarTrek ? (
                            <Button key={index} variant="link" className="p-0 h-auto" onClick={() => handleTrekClick(similarTrek)}>
                              {similarTrek.name} ({similarTrek.difficulty})
                            </Button>
                          ) : null;
                        })}
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Reviews */}
                {selectedTrek.interactive.reviews.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleSection('reviews')}>
                      <CardTitle>Reviews</CardTitle>
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    {expandedSections.reviews && (
                      <CardContent className="space-y-4">
                        {selectedTrek.interactive.reviews.map((review, index) => (
                          <div key={index} className="border-b pb-2 last:border-b-0">
                            <div className="flex items-center gap-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">{review.author} on {review.date}</span>
                            </div>
                            <p className="text-gray-800">{review.comment}</p>
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    portalRoot
  );
}
