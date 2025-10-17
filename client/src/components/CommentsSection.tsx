import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageCircle, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  isApproved: boolean;
  likes: number;
}

interface CommentsSectionProps {
  articleId: string;
}

export function CommentsSection({ articleId }: CommentsSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${articleId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: { authorName: string; authorEmail: string; content: string }) => {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
      setName("");
      setEmail("");
      setContent("");
      toast({
        title: "Comentario enviado",
        description: "Tu comentario será revisado antes de publicarse",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo enviar el comentario",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCommentMutation.mutate({ authorName: name, authorEmail: email, content });
  };

  const approvedComments = comments?.filter(c => c.isApproved) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comentarios ({approvedComments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pb-6 border-b">
          <h3 className="font-semibold">Deja tu comentario</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email (no será publicado)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Textarea
            placeholder="Escribe tu comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
          />
          <Button type="submit" disabled={addCommentMutation.isPending}>
            {addCommentMutation.isPending ? "Enviando..." : "Publicar Comentario"}
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Cargando comentarios...</p>
          ) : approvedComments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Sé el primero en comentar este artículo
            </p>
          ) : (
            approvedComments.map((comment) => (
              <div key={comment.id} className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-sm">{comment.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
