import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";

// Define the context interface
interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

// Create context with INITIAL STATE (not undefined!)
const initialSidebarState: SidebarContextProps = {
  open: false,
  setOpen: () => null, // Placeholder function
  animate: true,
};

const SidebarContext = createContext<SidebarContextProps>(initialSidebarState);

// Create hook WITHOUT error check (context always has default value)
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  return context; // No error check needed!
};

// Create Provider component
export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Optional wrapper component (for convenience)
export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

// Sidebar body with CSS transitions (no framer-motion!)
export const SidebarBody = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen, animate } = useSidebar();
  const width = animate ? (open ? "300px" : "60px") : "300px";
  
  return (
    <div
      className={cn(
        "h-screen px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 transition-all duration-200 ease-in-out",
        className
      )}
      style={{ width }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
};

// Sidebar link component
export const SidebarLink = ({
  link,
  className,
  isActive,
  ...props
}: {
  link: Links;
  className?: string;
  isActive?: boolean;
  props?: React.ComponentProps<typeof Link>;
}) => {
  const { open, animate } = useSidebar();
  const isTextVisible = !animate || open;
  
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2",
        isActive && "text-neutral-900 dark:text-neutral-100 font-medium",
        !isActive && "text-neutral-700 dark:text-neutral-200",
        className
      )}
      {...props}
    >
      {link.icon}
      <span
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition-all duration-150 whitespace-pre",
          isTextVisible ? "opacity-100 inline-block" : "opacity-0 w-0 overflow-hidden"
        )}
      >
        {link.label}
      </span>
    </Link>
  );
};

