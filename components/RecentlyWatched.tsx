"use client";

import { WatchEntry } from "@/types";
import { Card } from "@/components/ui/card";
import { Star, Calendar } from "lucide-react";

interface RecentlyWatchedProps {
  entries: WatchEntry[];
}

export function RecentlyWatched({ entries }: RecentlyWatchedProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recently Watched</h3>
      {entries.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No entries yet. Start tracking your watched content!
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{entry.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>{entry.type}</span>
                    <span>•</span>
                    <span>{entry.platform}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{entry.rating}/5</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.dateWatched).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}