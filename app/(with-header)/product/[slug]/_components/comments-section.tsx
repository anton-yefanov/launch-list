"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, ChevronUp, Reply } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface CommentData {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    image?: string;
  };
  parentComment?: CommentData;
  upvoters: string[];
  createdAt: string;
  replies?: CommentData[];
}

interface CommentsSectionProps {
  startupId: string;
}

export default function CommentsSection({ startupId }: CommentsSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?startupId=${startupId}`);
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [startupId]);

  const handleSubmitComment = async (
    content: string,
    parentCommentId?: string,
  ) => {
    if (!session) {
      toast.error("Please login to comment");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          startupId,
          parentCommentId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchComments();
        if (parentCommentId) {
          setReplyContent("");
          setReplyingTo(null);
        } else {
          setNewComment("");
        }
        toast.success("Comment added!");
      } else {
        toast.error(data.error || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (commentId: string) => {
    if (!session) {
      toast.error("Please sign in to upvote");
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/upvote`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        // Update upvotes for nested comments recursively
        const updateUpvotesRecursively = (
          comments: CommentData[],
        ): CommentData[] => {
          return comments.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                upvoters: data.upvoted
                  ? [...comment.upvoters, session.user.id]
                  : comment.upvoters.filter((id) => id !== session.user.id),
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: updateUpvotesRecursively(comment.replies),
              };
            }
            return comment;
          });
        };

        setComments((prev) => updateUpvotesRecursively(prev));
      } else {
        toast.error(data.error || "Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting comment:", error);
      toast.error("Failed to upvote");
    }
  };

  const organizeComments = (comments: CommentData[]) => {
    const topLevel = comments.filter((comment) => !comment.parentComment);
    const replies = comments.filter((comment) => comment.parentComment);

    const buildCommentTree = (parentId: string): CommentData[] => {
      return replies
        .filter((reply) => reply.parentComment?._id === parentId)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((reply) => ({
          ...reply,
          replies: buildCommentTree(reply._id),
        }));
    };

    return topLevel
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
      .map((comment) => ({
        ...comment,
        replies: buildCommentTree(comment._id),
      }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  const renderComment = (comment: CommentData, depth: number = 0) => {
    const marginLeft = depth > 0 ? `ml-${Math.min(depth * 6, 24)}` : "";
    const avatarSize = depth === 0 ? "h-8 w-8" : "h-6 w-6";
    const textSize = depth === 0 ? "text-sm" : "text-sm";
    const replyButtonSize = depth === 0 ? "h-7 px-2" : "h-6 px-2 text-xs";
    const upvoteIconSize = depth === 0 ? "h-4 w-4" : "h-3 w-3";

    return (
      <div key={comment._id} className={`${marginLeft}`}>
        <div className="flex gap-3 mb-3">
          <Avatar className={`${avatarSize} shrink-0`}>
            <AvatarImage src={comment.author.image} />
            <AvatarFallback>
              {comment.author.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${textSize}`}>
                {comment.author.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>

            <p className={`text-gray-700 mb-2 whitespace-pre-wrap ${textSize}`}>
              {comment.content}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpvote(comment._id)}
                className={`${replyButtonSize} ${
                  session && comment.upvoters.includes(session.user.id)
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-500"
                }`}
              >
                <ChevronUp className={`${upvoteIconSize} mr-1`} />
                {comment.upvoters.length}
              </Button>

              {session && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(comment._id)}
                  className={`${replyButtonSize} text-gray-500`}
                >
                  <Reply className={`${upvoteIconSize} mr-1`} />
                  Reply
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {replyingTo === comment._id && (
          <div className={`${depth > 0 ? "ml-9" : "ml-11"} mb-4 space-y-2`}>
            <Textarea
              placeholder="Write a reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleSubmitComment(replyContent, comment._id)}
                disabled={isSubmitting || !replyContent.trim()}
              >
                {isSubmitting ? "Posting..." : "Reply"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className={`${depth > 0 ? "ml-9" : "ml-11"} space-y-0`}>
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const organizedComments = organizeComments(comments);

  if (loading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      {/* New Comment Form */}
      {session ? (
        <div className="mb-6">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
            rows={3}
          />
          <Button
            onClick={() => handleSubmitComment(newComment)}
            disabled={isSubmitting || !newComment.trim()}
            size="sm"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Please login to leave a comment</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {organizedComments.map((comment) => (
          <div key={comment._id} className="border rounded-lg p-4">
            {renderComment(comment)}
          </div>
        ))}
      </div>
    </div>
  );
}
