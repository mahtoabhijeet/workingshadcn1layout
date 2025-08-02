import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight, Camera, MapPin, Mountain, Ruler, Clock, Image, Video, FileText, Info, Lock, Phone } from 'lucide-react';

// Import types from lib/data.ts
import { Trek, Waypoint, Media } from '@/lib/data';

// Define KeyInfo interface locally as it's not exported from lib/data.ts
interface KeyInfo {
  icon: React.ElementType;
  text: string;
}

interface WaypointNavigatorPanelProps {
  trek: Trek; // Accept Trek prop
}

const WaypointNavigatorPanel: React.FC<WaypointNavigatorPanelProps> = ({ trek }) => {
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Handle cases where trek or trek.waypoints might be null/empty
  const currentWaypoint = trek.waypoints.length > 0 ? trek.waypoints[currentWaypointIndex] : null;
  const totalWaypoints = trek.waypoints.length;

  // Function to derive keyInfo from trek details and current waypoint
  const getKeyInfo = useCallback((waypoint: Waypoint, trekDetails: Trek['details']): KeyInfo[] => {
    const info: KeyInfo[] = [];
    if (trekDetails.startingPoint) {
      info.push({ icon: MapPin, text: `Start: ${trekDetails.startingPoint}` });
    }
    if (trekDetails.bestSeason) {
      info.push({ icon: Clock, text: `Best Season: ${trekDetails.bestSeason}` });
    }
    if (trekDetails.permitsRequired) {
      info.push({ icon: Lock, text: 'Permits Required' });
    }
    if (trekDetails.emergencyContact) {
      info.push({ icon: Phone, text: `Emergency: ${trekDetails.emergencyContact}` });
    }
    // Add waypoint specific info if available, e.g., from coordinates or other properties if they existed.
    // For now, we'll use coordinates as a placeholder if needed.
    if (waypoint && waypoint.coordinates) {
      info.push({ icon: MapPin, text: `Coords: ${waypoint.coordinates.join(', ')}` });
    }
    return info;
  }, []);

  const derivedKeyInfo = currentWaypoint ? getKeyInfo(currentWaypoint, trek.details) : [];

  const goToWaypoint = useCallback((index: number) => {
    if (index >= 0 && index < totalWaypoints) {
      setCurrentWaypointIndex(index);
    }
  }, [totalWaypoints]);

  const goToNextWaypoint = useCallback(() => {
    if (currentWaypointIndex < totalWaypoints - 1) {
      goToWaypoint(currentWaypointIndex + 1);
    }
  }, [currentWaypointIndex, goToWaypoint, totalWaypoints]);

  const goToPreviousWaypoint = useCallback(() => {
    if (currentWaypointIndex > 0) {
      goToWaypoint(currentWaypointIndex - 1);
    }
  }, [currentWaypointIndex, goToWaypoint]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextWaypoint();
      } else if (event.key === 'ArrowLeft') {
        goToPreviousWaypoint();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [goToNextWaypoint, goToPreviousWaypoint]);

  // Handle cases where there are no waypoints
  if (!currentWaypoint) {
    return (
      <div className="flex flex-col h-1/3 w-full border-t bg-background justify-center items-center p-4">
        <p className="text-muted-foreground">No waypoints available for this trek.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full border-t bg-background waypoint-panel"> {/* Changed h-1/3 to h-full to fill parent */}
      {/* Upper Panel: Waypoint Details */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4 flex-wrap">
          <h2 className="text-xl font-semibold flex items-center">
            <MapPin className="mr-2" size={20} /> {currentWaypoint.name}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {/* Using trek.details for these badges as per lib/data.ts structure */}
            <Badge variant="secondary" className="text-xs">
              <Mountain className="mr-1 h-3 w-3" /> {trek.details.elevation}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Ruler className="mr-1 h-3 w-3" /> {trek.details.distance}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Clock className="mr-1 h-3 w-3" /> {trek.details.duration}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Image className="mr-1 h-3 w-3" /> {currentWaypoint.media.photos.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <Video className="mr-1 h-3 w-3" /> {currentWaypoint.media.videos.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <FileText className="mr-1 h-3 w-3" /> {currentWaypoint.media.notes.length}
            </Badge>
          </div>
        </div>

        {/* Content Area (Two-Column Layout) */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left Column: Media Thumbnail */}
          <div className="w-full sm:w-36 flex-shrink-0">
            <Card className="aspect-square flex items-center justify-center overflow-hidden">
              {currentWaypoint.media.photos.length > 0 ? (
                <img
                  src={currentWaypoint.media.photos[0]?.thumbnailUrl || currentWaypoint.media.photos[0]?.url}
                  alt={`Thumbnail for ${currentWaypoint.media.photos[0]?.title || 'Waypoint Photo'}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="h-12 w-12 text-muted-foreground" />
              )}
            </Card>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setIsGalleryOpen(true)}
              disabled={currentWaypoint.media.photos.length === 0 && currentWaypoint.media.videos.length === 0 && currentWaypoint.media.notes.length === 0}
            >
              View Gallery
            </Button>
          </div>

          {/* Right Column: Text Content */}
          <div className="flex-1">
            <p className="text-sm leading-relaxed mb-4 text-muted-foreground">
              {currentWaypoint.description}
            </p>
            <div className="space-y-2">
              {derivedKeyInfo.map((info, index) => (
                <div key={index} className="flex items-center text-xs text-muted-foreground">
                  <info.icon className="mr-2 h-3 w-3 flex-shrink-0" /> {info.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Lower Panel: Trek Progress */}
      <div className="flex-shrink-0 p-4">
        {/* Progress Indicator */}
        <div className="flex flex-col items-center mb-4">
          <p className="text-sm text-muted-foreground mb-2">Trek Progress:</p>
          <div className="flex items-center justify-center w-full max-w-md">
            {trek.waypoints.map((waypoint, index) => (
              <React.Fragment key={waypoint.id}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`relative w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ease-in-out hover:scale-110
                          ${index <= currentWaypointIndex
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-background border-2 border-muted-foreground text-muted-foreground'
                          }`}
                        onClick={() => goToWaypoint(index)}
                        aria-label={`Go to waypoint ${index + 1}: ${waypoint.name}`}
                      >
                        {index + 1}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{waypoint.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {index < totalWaypoints - 1 && (
                  <div
                    className={`flex-1 h-1 rounded-full mx-1 transition-colors duration-200
                      ${index < currentWaypointIndex ? 'bg-primary' : 'bg-muted-foreground'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {currentWaypointIndex + 1}/{totalWaypoints} Complete
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={goToPreviousWaypoint}
            disabled={currentWaypointIndex === 0}
            aria-label="Previous Waypoint"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {currentWaypointIndex === 0 ? 'Back to Start' : trek.waypoints[currentWaypointIndex - 1]?.name}
          </Button>
          <Button
            variant="ghost"
            onClick={goToNextWaypoint}
            disabled={currentWaypointIndex === totalWaypoints - 1}
            aria-label="Next Waypoint"
          >
            {currentWaypointIndex === totalWaypoints - 1 ? 'Continue to Trail' : trek.waypoints[currentWaypointIndex + 1]?.name}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Media Gallery Sheet */}
      <Sheet open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <SheetContent side="bottom" className="h-2/3">
          <SheetHeader>
            <SheetTitle>Media Gallery for {currentWaypoint.name}</SheetTitle>
            <SheetDescription>
              Explore photos and videos from this waypoint.
            </SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 overflow-y-auto">
            {currentWaypoint.media.photos.map((photo, index) => (
              <Card key={`photo-${index}`} className="aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={`Waypoint Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </Card>
            ))}
            {currentWaypoint.media.videos.map((video, index) => (
              <Card key={`video-${index}`} className="aspect-video flex items-center justify-center bg-muted">
                <Video className="h-12 w-12 text-muted-foreground" />
                <span className="sr-only">Video {index + 1}</span>
              </Card>
            ))}
            {currentWaypoint.media.notes.map((note, index) => (
              <Card key={`note-${index}`} className="p-4 flex items-center justify-center text-center bg-muted text-muted-foreground">
                <FileText className="mr-2 h-5 w-5" />
                <p className="text-sm">{note.content}</p>
              </Card>
            ))}
            {currentWaypoint.media.photos.length === 0 &&
             currentWaypoint.media.videos.length === 0 &&
             currentWaypoint.media.notes.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No media available for this waypoint.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WaypointNavigatorPanel;
