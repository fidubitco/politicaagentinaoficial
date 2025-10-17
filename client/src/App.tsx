import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminArticleForm from "@/pages/admin/AdminArticleForm";
import AdminSources from "@/pages/admin/AdminSources";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminGenerator from "@/pages/admin/AdminGenerator";
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
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
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
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
