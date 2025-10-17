import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminArticleForm from "@/pages/admin/AdminArticleForm";
import AdminSources from "@/pages/admin/AdminSources";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminGenerator from "@/pages/admin/AdminGenerator";
import AdminBulkGenerator from "@/pages/admin/AdminBulkGenerator";
import ArticlePage from "@/pages/ArticlePage";
import NotFound from "@/pages/not-found";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div className="hidden sm:block">
                <h2 className="text-sm font-semibold">Panel de Administración</h2>
                <p className="text-xs text-muted-foreground">POLÍTICA ARGENTINA</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-view-site" asChild>
              <Link href="/">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Ver Sitio Público</span>
                <span className="sm:hidden">Sitio</span>
              </Link>
            </Button>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      
      {/* Category Page */}
      <Route path="/categoria/:slug" component={CategoryPage} />
      
      {/* Article Page */}
      <Route path="/articulo/:slug" component={ArticlePage} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/articles">
        <AdminLayout>
          <AdminArticles />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/articles/new">
        <AdminLayout>
          <AdminArticleForm />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/articles/:id/edit">
        <AdminLayout>
          <AdminArticleForm />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/sources">
        <AdminLayout>
          <AdminSources />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/categories">
        <AdminLayout>
          <AdminCategories />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/generator">
        <AdminLayout>
          <AdminGenerator />
        </AdminLayout>
      </Route>
      
      <Route path="/admin/bulk-generator">
        <AdminLayout>
          <AdminBulkGenerator />
        </AdminLayout>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
