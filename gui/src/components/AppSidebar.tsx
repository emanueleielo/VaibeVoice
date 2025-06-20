
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Clock, Settings, Globe, Play, AlertTriangle } from "lucide-react";
import { useApiKeyStatus } from "@/hooks/useApiKeyStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Playground",
    url: "/playground",
    icon: Play,
  },
  {
    title: "History",
    url: "/history", 
    icon: Clock,
  },
  {
    title: "Language",
    url: "/language",
    icon: Globe,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { isApiKeySet, loading: apiKeyLoading } = useApiKeyStatus();

  // Function to determine if a menu item should be disabled
  const isItemDisabled = (url: string) => {
    // Only disable items if API key is not set and we're not still loading
    if (apiKeyLoading || isApiKeySet) return false;

    // Never disable Home or Settings
    return url !== "/" && url !== "/settings";
  };

  return (
    <TooltipProvider>
      <Sidebar className="border-r border-slate-200 bg-white/80 backdrop-blur-sm">
        <SidebarHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <h1 className="text-xl font-bold text-slate-800">VaibVoice</h1>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const disabled = isItemDisabled(item.url);

                  // Render a tooltip for disabled items
                  const menuItem = (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={location.pathname === item.url} disabled={disabled}>
                        <Link 
                          to={disabled ? "#" : item.url}
                          onClick={e => disabled && e.preventDefault()}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            location.pathname === item.url 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700' 
                              : disabled
                                ? 'text-slate-400 cursor-not-allowed'
                                : 'text-slate-700 hover:text-slate-900 hover:bg-blue-50 font-medium'
                          }`}
                        >
                          <item.icon size={20} />
                          <span className="font-medium">{item.title}</span>
                          {disabled && <AlertTriangle size={16} className="ml-2 text-amber-500" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );

                  // Wrap disabled items in a tooltip
                  return disabled ? (
                    <Tooltip key={item.title}>
                      <TooltipTrigger asChild>
                        {menuItem}
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>Set OpenAI API key in Settings to enable this feature</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : React.cloneElement(menuItem, { key: item.title });
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-6">
          <div className="text-xs text-slate-500">
            v1.0.0 • AI Transcription
          </div>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}
