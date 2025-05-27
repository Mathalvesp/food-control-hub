
import { 
  Dashboard, 
  FileText, 
  BookOpen, 
  Package, 
  Cog
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Dashboard,
  },
  {
    title: "Ficha Técnica",
    url: "/ficha-tecnica",
    icon: FileText,
  },
  {
    title: "Receitas",
    url: "/receitas",
    icon: BookOpen,
  },
  {
    title: "Estoque",
    url: "/estoque",
    icon: Package,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Cog,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r-0 bg-sidebar">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.url)}
                      className={`text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors duration-200 ${
                        isActive ? 'bg-white text-primary font-medium' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
