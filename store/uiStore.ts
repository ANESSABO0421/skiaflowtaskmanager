import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";

  toggleSidebar: () => void;
  toggleTheme: () => void;
}


export const useUiStore=create<UIState>((set)=>({
    sidebarOpen:true,
    theme:'light',

    toggleSidebar:()=>set((state)=>({
        sidebarOpen:!state.sidebarOpen
    })),

    toggleTheme:()=>set((state)=>({
        theme:state.theme==='light'?'dark':'light',
    }))
}))