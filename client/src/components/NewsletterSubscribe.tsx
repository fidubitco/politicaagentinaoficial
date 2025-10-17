import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSubscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "" }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al suscribirse");
      }

      setSubscribed(true);
      setEmail("");
      toast({
        title: "¡Suscripción exitosa!",
        description: "Recibirás las últimas noticias en tu correo",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo completar la suscripción",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">¡Gracias por suscribirte!</h3>
          <p className="text-sm text-muted-foreground">
            Pronto recibirás las últimas noticias en tu correo
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Newsletter
        </CardTitle>
        <CardDescription>
          Recibe las noticias más importantes directo en tu correo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Suscribiendo..." : "Suscribirse"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
