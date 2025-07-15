"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { BlogPost } from "@/models/BlogPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateBlogDialog } from "./components/create-blog-dialog";
import { EditBlogDialog } from "./components/edit-blog-dialog";
import {
  Search,
  ExternalLink,
  Edit,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (post: BlogPost) => {
    setEditPost(post);
    setEditDialogOpen(true);
  };

  const handlePostUpdated = (updatedPost: BlogPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
    );
  };

  const handleDelete = async (postId: string, postTitle: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${postTitle}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(postId);
      const response = await fetch(`/api/blog/${postId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts(posts.filter((post) => post._id !== postId));
      setSelectedPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;

    const postTitles = posts
      .filter((post) => selectedPosts.has(post._id!))
      .map((post) => post.title)
      .join(", ");

    if (
      !confirm(
        `Are you sure you want to delete ${selectedPosts.size} posts?\n\nPosts: ${postTitles}\n\nThis action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedPosts).map((postId) =>
        fetch(`/api/blog/${postId}`, { method: "DELETE" }),
      );
      await Promise.all(deletePromises);

      setPosts(posts.filter((post) => !selectedPosts.has(post._id!)));
      setSelectedPosts(new Set());
    } catch {
      setError("Failed to delete some posts");
    } finally {
      setLoading(false);
    }
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map((post) => post._id!)));
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Admin</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your blog posts and content
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Blog
            </Link>
          </Button>
          <CreateBlogDialog onPostCreated={fetchPosts} />
        </div>
      </div>
      <EditBlogDialog
        post={editPost}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPostUpdated={handlePostUpdated}
      />

      <div className="flex flex-col mb-4 sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {selectedPosts.size > 0 && (
        <Alert className="mb-4">
          <AlertDescription className="flex items-center justify-between">
            <span>
              {selectedPosts.size} post{selectedPosts.size !== 1 ? "s" : ""}{" "}
              selected
            </span>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {filteredPosts.length === 0 && !loading ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">
            {searchTerm ? "No posts found" : "No blog posts yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by creating your first blog post"}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <CreateBlogDialog onPostCreated={fetchPosts} />
            </div>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedPosts.size === filteredPosts.length &&
                    filteredPosts.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPosts.has(post._id!)}
                    onCheckedChange={() => togglePostSelection(post._id!)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium truncate max-w-xs">
                      {post.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      /blog/{post.slug}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Published</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post._id!, post.title)}
                      disabled={deleteLoading === post._id}
                    >
                      {deleteLoading === post._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {error && (
        <Alert
          className="fixed bottom-4 right-4 max-w-md"
          variant="destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError("")}
              className="h-auto p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
