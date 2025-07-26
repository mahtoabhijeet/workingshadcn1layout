"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DynamicPanelProps {
  title: string;
  content?: React.ReactNode;
  className?: string;
}

export default function DynamicPanel({ title, content, className = '' }: DynamicPanelProps) {
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {content || (
          <div className="text-gray-500 text-sm">
            <p>Dynamic content will be displayed here.</p>
            <div className="mt-4 space-y-2">
              <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
