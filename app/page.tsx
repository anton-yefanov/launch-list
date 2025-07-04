"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink } from "lucide-react";
import { DIRECTORIES } from "@/constants/directories";
import SEO from "@/app/_components/seo";
import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";

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
    <>
      <SEO />
      <Header isListView={isListView} setIsListView={setIsListView} />
      <main>
        {isListView ? (
          <section
            className="space-y-3 max-w-4xl mx-auto"
            aria-label="Startup launch directories checklist"
          >
            <h3 className="sr-only">Startup Launch Checklist</h3>
            {DIRECTORIES?.map((directory, index) => {
              const IconComponent = directory.icon;
              const directoryId = `directory-${index}`;

              return (
                <article
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
                    aria-label={`Mark ${directory.name} as completed`}
                  />
                  <div
                    style={{ backgroundColor: directory.bgColor }}
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  >
                    <IconComponent
                      style={{ color: directory.iconColor }}
                      className="size-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-base">
                        {directory.name}
                      </h4>
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
                    aria-label={`Visit ${directory.name} website`}
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </button>
                </article>
              );
            }) || []}
          </section>
        ) : (
          <section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
            aria-label="Startup launch directories grid"
          >
            <h3 className="sr-only">Browse Startup Launch Platforms</h3>
            {DIRECTORIES?.map((directory, index) => {
              const IconComponent = directory.icon;

              return (
                <Card
                  key={index}
                  onClick={() => handleDirectoryClick(directory.url)}
                  className="group cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-[1.02] border-border/50 hover:border-primary/20 p-0"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleDirectoryClick(directory.url);
                    }
                  }}
                  aria-label={`Visit ${directory.name} - ${directory.description}`}
                >
                  <CardContent className="p-6">
                    <article className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            style={{ backgroundColor: directory.bgColor }}
                            className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <IconComponent
                              style={{ color: directory.iconColor }}
                              className="size-6"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                              {directory.name}
                            </h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {directory.category}
                            </Badge>
                          </div>
                        </div>
                        <ExternalLink
                          className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                          aria-hidden="true"
                        />
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {directory.description}
                      </p>
                    </article>
                  </CardContent>
                </Card>
              );
            }) || []}
          </section>
        )}
      </main>
      <Footer isListView={isListView} />
    </>
  );
}
