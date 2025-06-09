"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Rocket, List, Grid } from "lucide-react";
import { DIRECTORIES } from "@/constants/directories";

export default function StartupDirectories() {
  const [isListView, setIsListView] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedCheckedItems = localStorage.getItem("startupDirectoriesChecked");
    if (savedCheckedItems) {
      setCheckedItems(JSON.parse(savedCheckedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "startupDirectoriesChecked",
      JSON.stringify(checkedItems),
    );
  }, [checkedItems]);

  const handleDirectoryClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-6">
          <a
            href="https://x.com/anton_yefanov"
            target="_blank"
            className="block mb-4 w-fit mx-auto text-gray-500 hover:text-foreground transition hover:underline"
          >
            by Anton
          </a>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Startup Launch Directories
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the best platforms to launch your startup and reach early
            adopters, investors, and potential customers.
          </p>
          <div className="flex items-center justify-center gap-4 md:gap-2 mt-6 flex-col md:flex-row">
            <Badge variant="secondary" className="text-sm gap-2">
              <div className="flex items-center gap-2 pl-1">
                <div className="relative size-2">
                  <div className="absolute size-2 bg-green-500 rounded-full" />
                  <div className="absolute size-2 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
              </div>
              {DIRECTORIES.length} Platforms Available
            </Badge>
            <div className="flex items-center space-x-2 ml-4">
              <Grid
                className={`h-4 w-4 ${!isListView ? "text-primary" : "text-muted-foreground"}`}
              />
              <Switch
                checked={isListView}
                onCheckedChange={setIsListView}
                id="view-mode"
              />
              <List
                className={`h-4 w-4 ${isListView ? "text-primary" : "text-muted-foreground"}`}
              />
              <span className="text-sm text-muted-foreground">
                {isListView ? "Checklist View" : "Grid View"}
              </span>
            </div>
          </div>
        </div>
        {isListView ? (
          <div className="space-y-3 max-w-4xl mx-auto">
            {DIRECTORIES.map((directory, index) => {
              const IconComponent = directory.icon;
              const directoryId = `directory-${index}`;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-card border border-border/50 rounded-lg hover:border-primary/20 transition-all"
                >
                  <Checkbox
                    id={directoryId}
                    checked={checkedItems[directoryId]}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(directoryId, checked === true)
                    }
                    className="h-5 w-5"
                  />
                  <div
                    style={{ backgroundColor: directory.bgColor }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <IconComponent
                      style={{ color: directory.iconColor }}
                      className="size-5"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-base">
                        {directory.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-xs hidden md:flex"
                      >
                        {directory.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {directory.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDirectoryClick(directory.url)}
                    className="ml-2 p-2 rounded-full hover:bg-muted hidden md:flex transition-colors"
                    aria-label={`Visit ${directory.name}`}
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DIRECTORIES.map((directory, index) => {
              const IconComponent = directory.icon;

              return (
                <Card
                  key={index}
                  onClick={() => handleDirectoryClick(directory.url)}
                  className="group cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/20 p-0"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            style={{ backgroundColor: directory.bgColor }}
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <IconComponent
                              style={{ color: directory.iconColor }}
                              className="size-6"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                              {directory.name}
                            </h3>
                            <Badge variant="outline" className="text-xs mt-1">
                              {directory.category}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {directory.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        <div className="text-center mt-16 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Rocket className="size-4" />
            <p className="text-sm">
              {isListView
                ? "Check off directories as you submit your startup"
                : "Click on any directory to visit their website and start launching your startup"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground/70">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
