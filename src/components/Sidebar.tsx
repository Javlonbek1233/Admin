import React, { useState } from 'react';
import { useAppSelector, useAppDispatch, toggleTheme } from '../store';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShoppingBag,
  Calendar,
  History,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sun,
  Moon,
  Compass
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeSection,
  onSectionChange,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  
  // Real-time unread badges
  const notifications = useAppSelector((state) => state.notifications.list);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  
  const orders = useAppSelector((state) => state.orders.list);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;

  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'users', label: 'User Directory', icon: Users, badge: null },
    { id: 'orders', label: 'Orders Registry', icon: CreditCard, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null, badgeColor: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/25' },
    { id: 'products', label: 'Product Inventory', icon: ShoppingBag, badge: null },
    { id: 'calendar', label: 'System Calendar', icon: Calendar, badge: null },
    { id: 'timeline', label: 'Activity Audit Log', icon: History, badge: null },
    { id: 'notifications', label: 'Alert Center', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : null, badgeColor: 'bg-rose-500/10 text-rose-500 border-rose-500/25' },
  ];

  const handleSelect = (id: string) => {
    onSectionChange(id);
    setIsMobileOpen(false); // Close mobile drawer if clicked
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none">
      {/* Top Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-150 dark:border-slate-850">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20">
              <Compass className="h-5 w-5 animate-pulse" />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-[14px] font-bold tracking-tight text-slate-800 dark:text-slate-100 uppercase">
                  APEX CORE
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                  ENTERPRISE v5.0
                </span>
              </motion.div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-5 w-5 items-center justify-center rounded-md border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
          >
            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1 py-6 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group relative flex items-center gap-3.5 w-full rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-blue-600/10 to-indigo-600/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-100 border-l-4 border-transparent'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors duration-150 ${
                  isActive ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-350'
                }`}>
                  <IconComponent className="h-4.5 w-4.5" />
                </div>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate flex-1 text-left"
                  >
                    {item.label}
                  </motion.span>
                )}
                {!isCollapsed && item.badge && (
                  <span className={`flex items-center justify-center h-5 px-1.5 min-w-[20px] rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 z-50 rounded-md bg-slate-800 dark:bg-slate-950 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-md">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* User Info Footing & Theme Toggle */}
      <div className="flex flex-col gap-4 border-t border-slate-150 dark:border-slate-850 p-4">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-100"
        >
          {darkMode ? (
            <>
              <Sun className="h-4.5 w-4.5 text-amber-500" />
              {!isCollapsed && <span className="text-left flex-1">Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="h-4.5 w-4.5 text-indigo-500" />
              {!isCollapsed && <span className="text-left flex-1">Dark Mode</span>}
            </>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-3.5 px-2">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
            alt="Sarah Jenkins"
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-500/20"
          />
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                Sarah Jenkins
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <ShieldAlert className="h-3 w-3 text-blue-500" /> Administrator
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Layout */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col h-screen h-sticky top-0 shrink-0 select-none z-30 ${
          isCollapsed ? 'w-20' : 'w-64'
        } transition-all duration-200`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div id="mobile-sidebar-portal" className="fixed inset-0 z-40 md:hidden flex">
          {/* Mobile Backdrop */}
          <div
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 bg-slate-900/65 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ opacity: 0, x: -240 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -240 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-64 max-w-sm flex-col bg-white dark:bg-slate-900 h-full shadow-2xl z-50 flex"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  );
}
