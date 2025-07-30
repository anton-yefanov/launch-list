"use client";

import { Button } from "@/components/ui/button";
import { Edit, Palette, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DirectoryTag } from "@/types/DirectoryTag";
import { SubmitDifficulty } from "@/types/SubmitDifficulty";
import { useSession } from "next-auth/react";

enum SubmissionStatus {
  Pending = "PENDING",
  Approved = "APPROVED",
  Rejected = "REJECTED",
}

interface ISubmittedDirectory {
  _id: string;
  name: string;
  description: string;
  url: string;
  submittedBy: string;
  status: SubmissionStatus;
  submitterEmail: string;
  tallyEventId: string;
  submittedAt: string;
  bgColor?: string;
  domainRating?: number;
  viewsPerMonth?: number;
  tags?: DirectoryTag[];
  submitDifficulty?: SubmitDifficulty;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  about?: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SubmittedDirectoriesResponse {
  submittedDirectories: ISubmittedDirectory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ReviewFormData {
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

const initialReviewFormData: ReviewFormData = {
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

// Status Badge Component
const StatusBadge = ({ status }: { status: SubmissionStatus }) => {
  const statusConfig = {
    [SubmissionStatus.Pending]: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
    },
    [SubmissionStatus.Approved]: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle2,
    },
    [SubmissionStatus.Rejected]: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
  };

  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1", config.color)}>
      <IconComponent className="h-3 w-3" />
      {status}
    </Badge>
  );
};

// Submitted Directory Card Component
const SubmittedDirectoryCard = ({
  directory,
  onReview,
  onReject,
}: {
  directory: ISubmittedDirectory;
  onReview: (directory: ISubmittedDirectory) => void;
  onReject: (directoryId: string) => void;
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{directory.name}</h3>
            <StatusBadge status={directory.status} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {directory.description}
          </p>
          <div className="flex items-center gap-2">
            <a
              href={directory.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {directory.url}
            </a>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {directory.status === SubmissionStatus.Pending && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={() => onReview(directory)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Review
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Review and approve submission</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onReject(directory._id)}
                    className="gap-1"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reject submission</TooltipContent>
              </Tooltip>
            </>
          )}
          {directory.status !== SubmissionStatus.Pending && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReview(directory)}
                  className="gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </TooltipTrigger>
              <TooltipContent>View details</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminSubmittedDirectoriesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  // Initialize with empty array to prevent undefined errors
  const [submittedDirectories, setSubmittedDirectories] = useState<
    ISubmittedDirectory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewingDirectory, setReviewingDirectory] =
    useState<ISubmittedDirectory | null>(null);
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>(
    initialReviewFormData,
  );
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rejectConfirmId, setRejectConfirmId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuth = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return;
    if (!isAuth || !isAdmin) {
      router.push("/");
      return;
    }
  }, [isAuth, isAdmin, status, router]);

  useEffect(() => {
    const fetchSubmittedDirectories = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const response = await fetch("/api/admin/submitted-directories");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: SubmittedDirectoriesResponse = await response.json();

        // Ensure we always set an array, even if the response is malformed
        if (data && Array.isArray(data.submittedDirectories)) {
          setSubmittedDirectories(data.submittedDirectories);
        } else {
          console.warn("Invalid response format:", data);
          setSubmittedDirectories([]);
        }
      } catch (err) {
        console.error("Error fetching submitted directories:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load submitted directories");
        // Keep empty array on error
        setSubmittedDirectories([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchSubmittedDirectories();
    }
  }, [isAdmin]);

  const resetReviewForm = () => {
    setReviewFormData(initialReviewFormData);
  };

  const handleReview = (directory: ISubmittedDirectory) => {
    setReviewingDirectory(directory);
    setReviewFormData({
      name: directory.name,
      description: directory.description,
      url: directory.url,
      bgColor: directory.bgColor || "#000000",
      domainRating: directory.domainRating || 0,
      viewsPerMonth: directory.viewsPerMonth || 0,
      tags: directory.tags || [],
      submitDifficulty: directory.submitDifficulty || SubmitDifficulty.Ok,
      seoTitle: directory.seoTitle || "",
      seoDescription: directory.seoDescription || "",
      h1: directory.h1 || "",
      about: directory.about || "",
    });
    setIsReviewDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!reviewingDirectory) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/admin/submitted-directories/${reviewingDirectory._id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewFormData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve submission");
      }

      // Update the submission in state
      setSubmittedDirectories((prev) =>
        prev.map((dir) =>
          dir._id === reviewingDirectory._id
            ? { ...dir, status: SubmissionStatus.Approved, ...reviewFormData }
            : dir,
        ),
      );

      toast.success("Submission approved and added to directories!");
      setIsReviewDialogOpen(false);
      setReviewingDirectory(null);
      resetReviewForm();
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve submission",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (directoryId: string) => {
    try {
      const response = await fetch(
        `/api/admin/submitted-directories/${directoryId}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminNotes: "Submission rejected by admin",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reject submission");
      }

      // Update the submission in state
      setSubmittedDirectories((prev) =>
        prev.map((dir) =>
          dir._id === directoryId
            ? { ...dir, status: SubmissionStatus.Rejected }
            : dir,
        ),
      );

      toast.success("Submission rejected");
      setRejectConfirmId(null);
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("Failed to reject submission");
    }
  };

  const handleTagToggle = (tag: DirectoryTag) => {
    setReviewFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];

      return { ...prev, tags: newTags };
    });
  };

  const renderReviewFormContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={reviewFormData.name}
            onChange={(e) =>
              setReviewFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            maxLength={100}
            placeholder="Enter website name"
          />
        </div>

        <div>
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            value={reviewFormData.url}
            onChange={(e) =>
              setReviewFormData((prev) => ({ ...prev, url: e.target.value }))
            }
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="bgColor">Background Color</Label>
          <ColorPicker
            color={reviewFormData.bgColor}
            onChange={(color) =>
              setReviewFormData((prev) => ({ ...prev, bgColor: color }))
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
              value={reviewFormData.domainRating}
              onChange={(e) =>
                setReviewFormData((prev) => ({
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
              value={reviewFormData.viewsPerMonth}
              onChange={(e) =>
                setReviewFormData((prev) => ({
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
            value={reviewFormData.submitDifficulty}
            onValueChange={(value: SubmitDifficulty) =>
              setReviewFormData((prev) => ({
                ...prev,
                submitDifficulty: value,
              }))
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
                  checked={reviewFormData.tags.includes(tag)}
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
            value={reviewFormData.description}
            onChange={(e) =>
              setReviewFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
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
            value={reviewFormData.seoTitle}
            onChange={(e) =>
              setReviewFormData((prev) => ({
                ...prev,
                seoTitle: e.target.value,
              }))
            }
            maxLength={60}
            placeholder="SEO title (max 60 characters)"
          />
        </div>

        <div>
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Textarea
            id="seoDescription"
            value={reviewFormData.seoDescription}
            onChange={(e) =>
              setReviewFormData((prev) => ({
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
            value={reviewFormData.h1}
            onChange={(e) =>
              setReviewFormData((prev) => ({ ...prev, h1: e.target.value }))
            }
            maxLength={100}
            placeholder="H1 heading"
          />
        </div>

        <div>
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            value={reviewFormData.about}
            onChange={(e) =>
              setReviewFormData((prev) => ({ ...prev, about: e.target.value }))
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
              <Skeleton className="h-[28px] w-[200px] my-auto" />
            ) : (
              <div className="text-xl font-semibold">
                Submitted Directories: {submittedDirectories?.length || 0}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-1">
          {loading ? (
            <>
              {new Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-[150px] w-full border" />
              ))}
            </>
          ) : (
            <>
              {submittedDirectories.length === 0 ? (
                <p>No submitted directories found.</p>
              ) : (
                submittedDirectories.map((directory) => (
                  <SubmittedDirectoryCard
                    key={directory._id}
                    directory={directory}
                    onReview={handleReview}
                    onReject={setRejectConfirmId}
                  />
                ))
              )}
            </>
          )}
        </div>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {reviewingDirectory?.status === SubmissionStatus.Pending
                  ? "Review Submission"
                  : "View Submission Details"}
              </DialogTitle>
              <DialogDescription>
                {reviewingDirectory?.status === SubmissionStatus.Pending
                  ? "Review and complete the directory information before approving."
                  : "View the submission details and admin notes."}
              </DialogDescription>
            </DialogHeader>

            {/* Submission Info */}
            {reviewingDirectory && (
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Submitted by:</strong>{" "}
                    {reviewingDirectory.submitterEmail}
                  </div>
                  <div>
                    <strong>Submitted on:</strong>{" "}
                    {new Date(
                      reviewingDirectory.submittedAt,
                    ).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <StatusBadge status={reviewingDirectory.status} />
                  </div>
                </div>
                {reviewingDirectory.tallyEventId && (
                  <div className="mt-2 text-sm">
                    <strong>Tally Event ID:</strong>{" "}
                    {reviewingDirectory.tallyEventId}
                  </div>
                )}
              </div>
            )}

            {renderReviewFormContent()}

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReviewDialogOpen(false);
                  setReviewingDirectory(null);
                  resetReviewForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {reviewingDirectory?.status === SubmissionStatus.Pending && (
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    "Approving..."
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve & Add to Directory
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Confirmation Dialog */}
        <AlertDialog
          open={!!rejectConfirmId}
          onOpenChange={() => setRejectConfirmId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Submission?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the submission as rejected. The submitter will be
                notified. This action can be reversed later if needed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => rejectConfirmId && handleReject(rejectConfirmId)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reject Submission
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
