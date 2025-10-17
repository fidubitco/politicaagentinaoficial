import { LayoutDashboard, FileText, Radio, FolderTree, Calendar, Settings } from "lucide-react";
import { Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Artículos",
    url: "/admin/articles",
    icon: FileText,
  },
  {
    title: "Fuentes",
    url: "/admin/sources",
    icon: Radio,
  },
  {
    title: "Categorías",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Calendario",
    url: "/admin/calendar",
    icon: Calendar,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <h2 className="text-lg font-serif font-bold">Panel Admin</h2>
        <p className="text-sm text-muted-foreground">Política Argentina</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión de Contenido</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Admin User</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
