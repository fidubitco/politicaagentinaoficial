import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const siteUrl = import.meta.env.VITE_SITE_URL || "https://politica-argentina.replit.app";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Contact form submitted:", data);
    
    toast({
      title: "¡Mensaje enviado!",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    
    reset();
    setIsSubmitting(false);
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contacto - POLÍTICA ARGENTINA",
    "url": `${siteUrl}/contacto`,
    "description": "Ponte en contacto con POLÍTICA ARGENTINA. Estamos aquí para atender tus consultas, sugerencias y propuestas.",
    "mainEntity": {
      "@type": "Organization",
      "name": "POLÍTICA ARGENTINA",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+54-11-5555-1234",
        "contactType": "Customer Service",
        "email": "contacto@politica-argentina.com.ar",
        "areaServed": "AR",
        "availableLanguage": "Spanish"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Corrientes 1234",
        "addressLocality": "Buenos Aires",
        "addressRegion": "CABA",
        "postalCode": "C1043",
        "addressCountry": "AR"
      }
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cómo puedo enviar una noticia o sugerencia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes usar nuestro formulario de contacto o enviarnos un email a redaccion@politica-argentina.com.ar con los detalles."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuál es el horario de atención?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nuestro equipo editorial trabaja 24/7 para mantenerte informado. Respondemos consultas de lunes a viernes de 9:00 a 18:00 hs."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo puedo reportar un error en un artículo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Envíanos un email a correcciones@politica-argentina.com.ar con el enlace del artículo y la corrección sugerida."
        }
      }
    ]
  };

  const faqs = [
    {
      question: "¿Cómo puedo enviar una noticia o sugerencia?",
      answer: "Puedes usar nuestro formulario de contacto o enviarnos un email a redaccion@politica-argentina.com.ar con los detalles."
    },
    {
      question: "¿Cuál es el horario de atención?",
      answer: "Nuestro equipo editorial trabaja 24/7 para mantenerte informado. Respondemos consultas de lunes a viernes de 9:00 a 18:00 hs."
    },
    {
      question: "¿Cómo puedo reportar un error en un artículo?",
      answer: "Envíanos un email a correcciones@politica-argentina.com.ar con el enlace del artículo y la corrección sugerida."
    },
    {
      question: "¿Ofrecen publicidad o espacios comerciales?",
      answer: "Sí, para consultas comerciales contacta a publicidad@politica-argentina.com.ar"
    },
    {
      question: "¿Puedo republicar contenido de POLÍTICA ARGENTINA?",
      answer: "Necesitas autorización previa. Contacta a licencias@politica-argentina.com.ar para solicitar permisos."
    }
  ];

  return (
    <>
      <SEOHead
        title="Contacto"
        description="Ponte en contacto con POLÍTICA ARGENTINA. Estamos aquí para atender tus consultas, sugerencias y propuestas. Horario de atención: Lunes a Viernes 9:00 - 18:00 hs."
        keywords={["contacto", "política argentina", "consultas", "sugerencias", "redacción"]}
        canonical={`${siteUrl}/contacto`}
      />
      
      <script type="application/ld+json">
        {JSON.stringify(contactPageSchema)}
      </script>
      
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-[hsl(185,60%,45%)] to-[hsl(185,60%,35%)] text-white">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 mb-6">
              Contacto
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" data-testid="text-contact-title">
              Estamos Para Atenderte
            </h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              ¿Tienes una consulta, sugerencia o propuesta? Nos encantaría escucharte.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <MessageSquare className="h-6 w-6 text-[hsl(185,60%,45%)]" />
                      Envíanos un Mensaje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Tu nombre"
                          data-testid="input-name"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          placeholder="tu@email.com"
                          data-testid="input-email"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Asunto</Label>
                        <Input
                          id="subject"
                          {...register("subject")}
                          placeholder="Motivo de tu consulta"
                          data-testid="input-subject"
                        />
                        {errors.subject && (
                          <p className="text-sm text-destructive">{errors.subject.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Mensaje</Label>
                        <Textarea
                          id="message"
                          {...register("message")}
                          placeholder="Escribe tu mensaje aquí..."
                          rows={6}
                          data-testid="input-message"
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message.message}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full gap-2"
                        disabled={isSubmitting}
                        data-testid="button-submit"
                      >
                        {isSubmitting ? (
                          "Enviando..."
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Enviar Mensaje
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Información de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <Mail className="h-5 w-5 text-[hsl(185,60%,45%)] mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href="mailto:contacto@politica-argentina.com.ar" className="text-muted-foreground hover:text-[hsl(185,60%,45%)]">
                          contacto@politica-argentina.com.ar
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="h-5 w-5 text-[hsl(185,60%,45%)] mt-0.5" />
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <a href="tel:+541155551234" className="text-muted-foreground hover:text-[hsl(185,60%,45%)]">
                          +54 11 5555-1234
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-[hsl(185,60%,45%)] mt-0.5" />
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-muted-foreground">
                          Av. Corrientes 1234<br />
                          C1043 CABA, Buenos Aires<br />
                          Argentina
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Clock className="h-5 w-5 text-[hsl(185,60%,45%)] mt-0.5" />
                      <div>
                        <p className="font-medium">Horario de Atención</p>
                        <p className="text-muted-foreground">
                          Lunes a Viernes<br />
                          9:00 - 18:00 hs
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Otras Consultas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium">Redacción</p>
                      <a href="mailto:redaccion@politica-argentina.com.ar" className="text-muted-foreground hover:text-[hsl(185,60%,45%)]">
                        redaccion@politica-argentina.com.ar
                      </a>
                    </div>
                    <div>
                      <p className="font-medium">Correcciones</p>
                      <a href="mailto:correcciones@politica-argentina.com.ar" className="text-muted-foreground hover:text-[hsl(185,60%,45%)]">
                        correcciones@politica-argentina.com.ar
                      </a>
                    </div>
                    <div>
                      <p className="font-medium">Publicidad</p>
                      <a href="mailto:publicidad@politica-argentina.com.ar" className="text-muted-foreground hover:text-[hsl(185,60%,45%)]">
                        publicidad@politica-argentina.com.ar
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-4">Preguntas Frecuentes</h2>
              <p className="text-lg text-muted-foreground">
                Respuestas a las consultas más comunes
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground" data-testid={`faq-answer-${index}`}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
