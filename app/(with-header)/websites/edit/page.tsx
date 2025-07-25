"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  FilterIcon as Funnel,
  ListFilter,
  Edit,
  Trash2,
  Check,
  Palette,
  Search,
  X,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Directory } from "@/components/directory";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DirectoryTag } from "@/types/DirectoryTag";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";
import { useSession } from "next-auth/react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { DirectoryType } from "@/types/DirectoryType";

interface DirectoriesResponse {
  directories: DirectoryType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

type SortOption = "none" | "a-z" | "z-a" | "dr-high" | "views-high";

interface FilterState {
  highTraffic: boolean;
  easySubmission: boolean;
  domainRating: [number, number];
  freeLaunch: boolean;
  paidLaunch: boolean;
  focusOnAI: boolean;
}

interface FormData {
  name: string;
  description: string;
  url: string;
  bgColor: string;
  domainRating: number;
  viewsPerMonth: number;
  tags: DirectoryTag[];
  submitDifficulty: SubmitDifficulty;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  about: string;
}

const sortOptions = [
  { value: "none" as const, label: "No Sort" },
  { value: "a-z" as const, label: "A - Z" },
  { value: "z-a" as const, label: "Z - A" },
  { value: "dr-high" as const, label: "DR (High to Low)" },
  { value: "views-high" as const, label: "Views (High to Low)" },
];

const initialFilterState: FilterState = {
  highTraffic: false,
  easySubmission: false,
  domainRating: [0, 100],
  freeLaunch: false,
  paidLaunch: false,
  focusOnAI: false,
};

const initialFormData: FormData = {
  name: "",
  description: "",
  url: "",
  bgColor: "#000000",
  domainRating: 0,
  viewsPerMonth: 0,
  tags: [],
  submitDifficulty: SubmitDifficulty.Ok,
  seoTitle: "",
  seoDescription: "",
  h1: "",
  about: "",
};

// Predefined color palette
const colorPalette = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#808080",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#c0c0c0",
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#ffeaa7",
  "#dda0dd",
  "#98d8c8",
  "#fdcb6e",
  "#6c5ce7",
  "#a29bfe",
  "#fd79a8",
  "#e17055",
  "#00b894",
  "#0984e3",
];

// Color Picker Component
const ColorPicker = ({
  color,
  onChange,
}: {
  color: string;
  onChange: (color: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(color);

  const handleColorSelect = (selectedColor: string) => {
    onChange(selectedColor);
    setCustomColor(selectedColor);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
            <Palette className="ml-auto h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Custom Color</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-12 h-8 p-1 border rounded"
              />
              <Input
                type="text"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  onChange(e.target.value);
                }}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium">Preset Colors</Label>
            <div className="grid grid-cols-6 gap-1 mt-2">
              {colorPalette.map((presetColor) => (
                <button
                  key={presetColor}
                  onClick={() => handleColorSelect(presetColor)}
                  className={cn(
                    "w-8 h-8 rounded border-2 hover:scale-110 transition-transform",
                    color === presetColor
                      ? "border-gray-800"
                      : "border-gray-300",
                  )}
                  style={{ backgroundColor: presetColor }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function AdminEditWebsitesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [directories, setDirectories] = useState<DirectoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("none");
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingDirectory, setEditingDirectory] =
    useState<DirectoryType | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuth = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";
  const hasSortActive = sortBy !== "none";

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!isAuth || !isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuth, isAdmin, status, router]);

  useEffect(() => {
    const fetchDirectories = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const response = await fetch("/api/directories");
        const data: DirectoriesResponse = await response.json();
        setDirectories(data.directories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load directories");
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchDirectories();
    }
  }, [isAdmin]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: CheckedState | [number, number],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const hasActiveFilters = useMemo(() => {
    return (
      filters.highTraffic ||
      filters.easySubmission ||
      filters.domainRating[0] > 0 ||
      filters.domainRating[1] < 100 ||
      filters.freeLaunch ||
      filters.paidLaunch ||
      filters.focusOnAI
    );
  }, [filters]);

  const filteredAndSortedDirectories = useMemo(() => {
    let filtered = directories;

    // Apply search filter first
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((directory) => {
        const nameMatch = directory.name.toLowerCase().includes(query);
        const urlMatch = directory.url.toLowerCase().includes(query);
        return nameMatch || urlMatch;
      });
    }

    // Apply other filters
    if (hasActiveFilters) {
      filtered = filtered.filter((directory) => {
        if (
          filters.highTraffic &&
          !directory.tags.includes(DirectoryTag.HighTraffic)
        ) {
          return false;
        }

        if (
          filters.easySubmission &&
          directory.submitDifficulty === SubmitDifficulty.High
        ) {
          return false;
        }

        if (
          directory.domainRating < filters.domainRating[0] ||
          directory.domainRating > filters.domainRating[1]
        ) {
          return false;
        }

        if (
          filters.freeLaunch &&
          !directory.tags.includes(DirectoryTag.FreeLaunch)
        ) {
          return false;
        }

        if (
          filters.paidLaunch &&
          !directory.tags.includes(DirectoryTag.PaidFeatures)
        ) {
          return false;
        }

        if (filters.focusOnAI && !directory.tags.includes(DirectoryTag.AI)) {
          return false;
        }

        return true;
      });
    }

    if (sortBy === "none") return filtered;

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "a-z":
          return a.name.localeCompare(b.name);
        case "z-a":
          return b.name.localeCompare(a.name);
        case "dr-high":
          return b.domainRating - a.domainRating;
        case "views-high":
          return b.viewsPerMonth - a.viewsPerMonth;
        default:
          return 0;
      }
    });
  }, [directories, sortBy, filters, hasActiveFilters, searchQuery]);

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (directory: DirectoryType) => {
    setEditingDirectory(directory);
    setFormData({
      name: directory.name,
      description: directory.description,
      url: directory.url,
      bgColor: directory.bgColor,
      domainRating: directory.domainRating,
      viewsPerMonth: directory.viewsPerMonth,
      tags: directory.tags,
      submitDifficulty: directory.submitDifficulty,
      seoTitle: directory.seoTitle || "",
      seoDescription: directory.seoDescription || "",
      h1: directory.h1 || "",
      about: directory.about || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      let response;
      let successMessage;

      if (editingDirectory) {
        // Update existing directory
        response = await fetch(
          `/api/admin/directories/${editingDirectory._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );
        successMessage = "Website updated successfully";
      } else {
        // Create new directory
        response = await fetch("/api/admin/directories/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        successMessage = "Website created successfully";
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save directory");
      }

      const savedDirectory = await response.json();

      if (editingDirectory) {
        // Update existing directory in state
        setDirectories((prev) =>
          prev.map((dir) =>
            dir._id === editingDirectory._id ? savedDirectory : dir,
          ),
        );
      } else {
        // Add new directory to state
        setDirectories((prev) => [...prev, savedDirectory]);
      }

      toast.success(successMessage);
      setIsEditDialogOpen(false);
      setIsCreateDialogOpen(false);
      setEditingDirectory(null);
      resetForm();
    } catch (error) {
      console.error("Error saving directory:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save website",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (directoryId: string) => {
    try {
      const response = await fetch(`/api/admin/directories/${directoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete directory");
      }

      setDirectories((prev) => prev.filter((dir) => dir._id !== directoryId));
      toast.success("Website deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error deleting directory:", error);
      toast.error("Failed to delete website");
    }
  };

  const handleTagToggle = (tag: DirectoryTag) => {
    setFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];

      return { ...prev, tags: newTags };
    });
  };

  const AdminButtonComponent = useCallback((directory: DirectoryType) => {
    return (
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger
            onClick={() => handleEdit(directory)}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "min-w-[85px] active:scale-92 transition-all duration-100",
            )}
          >
            <Edit size={16} />
            Edit
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Edit Website</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            onClick={() => setDeleteConfirmId(directory._id)}
            className={cn(
              buttonVariants({
                variant: "destructive",
                size: "sm",
              }),
              "min-w-[85px] active:scale-92 transition-all duration-100",
            )}
          >
            <Trash2 size={16} />
            Delete
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Delete Website</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }, []);

  const renderFormContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            maxLength={100}
            placeholder="Enter website name"
          />
        </div>

        <div>
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            value={formData.url}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="bgColor">Background Color</Label>
          <ColorPicker
            color={formData.bgColor}
            onChange={(color) =>
              setFormData((prev) => ({ ...prev, bgColor: color }))
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="domainRating">Domain Rating</Label>
            <Input
              id="domainRating"
              type="number"
              min="0"
              max="100"
              value={formData.domainRating}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  domainRating: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div>
            <Label htmlFor="viewsPerMonth">Views per Month</Label>
            <Input
              id="viewsPerMonth"
              type="number"
              min="0"
              value={formData.viewsPerMonth}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  viewsPerMonth: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="submitDifficulty">Submit Difficulty</Label>
          <Select
            value={formData.submitDifficulty}
            onValueChange={(value: SubmitDifficulty) =>
              setFormData((prev) => ({ ...prev, submitDifficulty: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SubmitDifficulty.High}>High</SelectItem>
              <SelectItem value={SubmitDifficulty.Ok}>Ok</SelectItem>
              <SelectItem value={SubmitDifficulty.Low}>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.values(DirectoryTag).map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={formData.tags.includes(tag)}
                  onCheckedChange={() => handleTagToggle(tag)}
                />
                <Label htmlFor={tag} className="text-sm">
                  {tag.replace(/_/g, " ")}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            maxLength={500}
            rows={3}
            placeholder="Enter website description"
          />
        </div>

        <div>
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={formData.seoTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
            }
            maxLength={60}
            placeholder="SEO title (max 60 characters)"
          />
        </div>

        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={formData.seoDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                seoDescription: e.target.value,
              }))
            }
            maxLength={160}
            rows={3}
            placeholder="SEO description (max 160 characters)"
          />
        </div>

        <div>
          <Label htmlFor="h1">H1</Label>
          <Input
            id="h1"
            value={formData.h1}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, h1: e.target.value }))
            }
            maxLength={100}
            placeholder="H1 heading"
          />
        </div>

        <div>
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            value={formData.about}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, about: e.target.value }))
            }
            maxLength={1000}
            rows={4}
            placeholder="About section content"
          />
        </div>
      </div>
    </div>
  );

  if (status === "loading" || !isAuth || !isAdmin) {
    return (
      <div className="text-center py-8">
        <Skeleton className="h-8 w-48 mx-auto mb-4" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error: {error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div>
        <div className="flex items-center justify-between pb-2 sticky top-17 bg-background z-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            {loading ? (
              <Skeleton className="h-[28px] w-[126px] my-auto" />
            ) : (
              <div className="text-xl font-semibold">
                Admin: {filteredAndSortedDirectories.length} Websites
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={loading} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={loading}
                  className={cn(
                    "size-8 bg-transparent",
                    hasSortActive &&
                      "border-sky-300 bg-sky-200/30 hover:bg-sky-300/20",
                  )}
                >
                  <ListFilter />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger autoFocus={false} asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={loading}
                  className={cn(
                    "size-8 active:scale-95 transition-all duration-100",
                    hasActiveFilters &&
                      "border-sky-300 bg-sky-200/30 hover:bg-sky-300/20",
                  )}
                >
                  <Funnel />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-auto p-1 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  <Separator />

                  {/* Boolean filters */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="highTraffic"
                        checked={filters.highTraffic}
                        onCheckedChange={(checked) =>
                          handleFilterChange("highTraffic", checked)
                        }
                      />
                      <Label
                        htmlFor="highTraffic"
                        className="text-sm font-normal"
                      >
                        High traffic
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="easySubmission"
                        checked={filters.easySubmission}
                        onCheckedChange={(checked) =>
                          handleFilterChange("easySubmission", checked)
                        }
                      />
                      <Label
                        htmlFor="easySubmission"
                        className="text-sm font-normal"
                      >
                        Easy submission
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="freeLaunch"
                        checked={filters.freeLaunch}
                        onCheckedChange={(checked) =>
                          handleFilterChange("freeLaunch", checked)
                        }
                      />
                      <Label
                        htmlFor="freeLaunch"
                        className="text-sm font-normal"
                      >
                        Free launch
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="paidLaunch"
                        checked={filters.paidLaunch}
                        onCheckedChange={(checked) =>
                          handleFilterChange("paidLaunch", checked)
                        }
                      />
                      <Label
                        htmlFor="paidLaunch"
                        className="text-sm font-normal"
                      >
                        Paid launch
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="focusOnAI"
                        checked={filters.focusOnAI}
                        onCheckedChange={(checked) =>
                          handleFilterChange("focusOnAI", checked)
                        }
                      />
                      <Label
                        htmlFor="focusOnAI"
                        className="text-sm font-normal"
                      >
                        Focus on AI
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Domain Rating Slider */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Domain Rating: {filters.domainRating[0]} -{" "}
                      {filters.domainRating[1]}
                    </Label>
                    <Slider
                      value={filters.domainRating}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "domainRating",
                          value as [number, number],
                        )
                      }
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>100</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4 mt-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              disabled={loading}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {loading ? (
            <>
              {new Array(20).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-[66px] w-full border" />
              ))}
            </>
          ) : (
            <>
              {filteredAndSortedDirectories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery || hasActiveFilters ? (
                    <div>
                      <p>No websites found matching your criteria.</p>
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          onClick={clearSearch}
                          className="mt-2"
                        >
                          Clear search
                        </Button>
                      )}
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          onClick={clearAllFilters}
                          className="mt-2 ml-2"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>No websites available.</p>
                      <Button onClick={handleCreate} className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        Create Your First Website
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                filteredAndSortedDirectories.map((directory) => (
                  <Directory
                    key={directory._id}
                    directory={directory}
                    buttonComponent={AdminButtonComponent(directory)}
                  />
                ))
              )}
            </>
          )}
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
              <DialogDescription>
                Add a new website to the directory. Fields marked with * are
                required.
              </DialogDescription>
            </DialogHeader>

            {renderFormContent()}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Website"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Website</DialogTitle>
              <DialogDescription>
                Update the website information below. Fields marked with * are
                required.
              </DialogDescription>
            </DialogHeader>

            {renderFormContent()}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingDirectory(null);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteConfirmId}
          onOpenChange={() => setDeleteConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                website from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
