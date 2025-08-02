"use client";

import React from 'react';
import { Trek } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import WaypointNavigatorPanel from './WaypointNavigatorPanel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

interface MapBottomDrawerProps {
  isOpen: boolean;
  trek: Trek | null;
  onClose: () => void;
  onTrekSelect: (trek: Trek) => void; // For similar treks
}

export default function MapBottomDrawer({ isOpen, trek, onClose }: MapBottomDrawerProps) {
  // The Dialog component itself manages the open state based on the 'open' prop.
  // We pass onClose to onOpenChange to handle closing.

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* No DialogTrigger needed as we control the modal via the isOpen prop */}
      <DialogContent
        className="sm:max-w-screen-lg max-h-[80vh] overflow-y-auto" // Modal sizing and overflow
        onInteractOutside={onClose} // Allow closing by clicking outside
        onOpenAutoFocus={(event) => event.preventDefault()} // Prevent auto focus on first element
      >
        <DialogHeader>
          <DialogTitle>{trek?.name || 'Trek Details'}</DialogTitle>
          <DialogDescription>
            Explore waypoint details and progress for the selected trek.
          </DialogDescription>
          {/* The close button is typically part of the header */}
          <DialogClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose} className="absolute right-4 top-4">
              <X className="w-5 h-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        {/* The WaypointNavigatorPanel will fill the remaining space */}
        {trek && <WaypointNavigatorPanel trek={trek} />}
      </DialogContent>
    </Dialog>
  );
}
