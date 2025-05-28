
import { 
  LayoutDashboard, 
  Tag, 
  Package2, 
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
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Categorias",
    url: "/categorias",
    icon: Tag,
  },
  {
    title: "Ingredientes",
    url: "/ingredientes",
    icon: Package2,
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
    <Sidebar className="border-r-0 bg-red-600 text-white" collapsible="icon">
      <SidebarHeader className="border-b border-red-500 p-4">
        <h2 className="text-xl font-bold text-white">24por7 FOOD</h2>
      </SidebarHeader>
      <SidebarContent className="bg-red-600">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => navigate(item.url)}
                      className={`text-white hover:bg-red-500 hover:text-white transition-colors duration-200 w-full justify-start ${
                        isActive ? 'bg-white text-red-600 font-medium' : ''
                      }`}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="text-sm">{item.title}</span>
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
