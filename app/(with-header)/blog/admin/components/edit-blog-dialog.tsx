"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { BlogPost } from "@/models/BlogPost";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EditBlogDialogProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated: (updatedPost: BlogPost) => void;
}

export function EditBlogDialog({
  post,
  open,
  onOpenChange,
  onPostUpdated,
}: EditBlogDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    telegraphUrl: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        telegraphUrl: post.telegraphUrl || "",
      });
      setError("");
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/blog/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update blog post");
      }

      onPostUpdated({ ...post, ...data.post });
      onOpenChange(false);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editTelegraphUrl">Telegraph URL</Label>
            <Input
              type="url"
              id="editTelegraphUrl"
              value={formData.telegraphUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  telegraphUrl: e.target.value,
                }))
              }
              placeholder="https://telegra.ph/Your-Post-Title-12-25"
            />
            <p className="text-xs text-muted-foreground">
              Update this to change the content source
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
