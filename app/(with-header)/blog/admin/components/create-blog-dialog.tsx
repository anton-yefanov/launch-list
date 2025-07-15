"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, Plus } from "lucide-react";

interface CreateBlogDialogProps {
  onPostCreated: () => void;
}

export function CreateBlogDialog({ onPostCreated }: CreateBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const [telegraphUrl, setTelegraphUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegraphUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      // Close dialog and reset form
      setOpen(false);
      setTelegraphUrl("");
      setError("");

      // Refresh posts list
      await onPostCreated();

      // Redirect to the new blog post
      router.push(`/blog/${data.post.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
        </DialogHeader>

        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>
                  Go to{" "}
                  <a
                    href="https://telegra.ph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    telegra.ph
                  </a>
                </li>
                <li>Write your blog post</li>
                <li>Click &#34;Publish&#34; on Telegraph</li>
                <li>Copy the URL and paste it below</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegraphUrl">Telegraph URL</Label>
            <Input
              type="url"
              id="telegraphUrl"
              value={telegraphUrl}
              onChange={(e) => setTelegraphUrl(e.target.value)}
              placeholder="https://telegra.ph/Your-Post-Title-12-25"
              required
            />
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
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Blog Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
