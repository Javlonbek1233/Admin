import { useState } from 'react';
import { useAppDispatch, useAppSelector, toggleTheme, toggleSearchOverlay, markAllAsRead, markAsRead } from '../store';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Sparkles,
  Inbox,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onNavigate: (section: string) => void;
  activeSection: string;
}

export default function Navbar({ onToggleMobileMenu, onNavigate, activeSection }: NavbarProps) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);
  
  // Notification states
  const notifications = useAppSelector((state) => state.notifications.list);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Capitalize section name for breadcrumb
  const getBreadcrumbName = () => {
    switch (activeSection) {
      case 'dashboard':
        return 'System Performance Analytics';
      case 'users':
        return 'User Directories & Security Accounts';
      case 'orders':
        return 'Financial Operations Ledger';
      case 'products':
        return 'Enterprise Stock & Inventory';
      case 'calendar':
        return 'Operations Scheduling Engine';
      case 'timeline':
        return 'Audit Logs & Systems History';
      case 'notifications':
        return 'Core Alert Routing Feeds';
      default:
        return 'Console Core';
    }
  };

  const handleNotifClick = (id: string) => {
    dispatch(markAsRead(id));
    setShowNotifMenu(false);
    onNavigate('notifications');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-16 transition-colors duration-200">
      <div className="flex h-full items-center justify-between px-6">
        
        {/* Left: Menu Trigger & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobileMenu}
            className="rounded-lg p-1.5 md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100"
          >
            <Menu className="h-5.5 w-5.5" />
          </button>

          {/* Breadcrumb Info */}
          <div className="hidden sm:flex flex-col select-none">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
              <span>Platform Control Console</span>
              <span>/</span>
              <span className="text-blue-500 dark:text-blue-400">{activeSection}</span>
            </div>
            <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              {getBreadcrumbName()}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Spotlight Search Trigger */}
          <button
            onClick={() => dispatch(toggleSearchOverlay())}
            className="flex items-center gap-2 max-w-[280px] w-48 lg:w-64 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 px-3 py-2 text-xs text-slate-400 dark:text-slate-500 font-medium transition-all group cursor-pointer"
          >
            <Search className="h-4 w-4 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-400" />
            <span className="flex-1 text-left select-none text-slate-400 dark:text-slate-500">Quick search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-sm border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 shadow-sm leading-none">
              ⌘K
            </kbd>
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="rounded-xl p-2.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-600 dark:hover:text-slate-300 transition-colors tooltip relative cursor-pointer"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-indigo-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowProfileMenu(false);
              }}
              className="rounded-xl p-2.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-600 dark:hover:text-slate-300 transition-colors relative cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-80 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-1"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-150 dark:border-slate-850">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase font-mono">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Alert Feed ({unreadNotifCount})
                      </span>
                      {unreadNotifCount > 0 && (
                        <button
                          onClick={() => {
                            dispatch(markAllAsRead());
                            setShowNotifMenu(false);
                          }}
                          className="text-[10px] font-bold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase font-mono"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[240px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col items-center gap-1.5">
                          <Inbox className="h-6 w-6 opacity-30 text-slate-400" /> All alerts processed!
                        </div>
                      ) : (
                        notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotifClick(n.id)}
                            className={`flex flex-col gap-0.5 p-3 rounded-lg text-left cursor-pointer transition-colors ${
                              n.read
                                ? 'hover:bg-slate-50 dark:hover:bg-slate-800/45 text-slate-500 dark:text-slate-400'
                                : 'bg-slate-50/70 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-100'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="truncate pr-2">{n.message}</span>
                              <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase shrink-0">
                                {n.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {n.description}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-slate-150 dark:border-slate-850 p-2.5 bg-slate-50/50 dark:bg-slate-900/50">
                      <button
                        onClick={() => {
                          setShowNotifMenu(false);
                          onNavigate('notifications');
                        }}
                        className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-350 transition-colors font-mono uppercase"
                      >
                        View all critical alerts
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

          {/* User Profile Summary Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-1.5 focus:outline-hidden group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                alt="Sarah Jenkins"
                className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-slate-150 dark:ring-slate-800 group-hover:ring-blue-500/20"
              />
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2.5 w-56 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-50 p-1"
                  >
                    {/* Header info */}
                    <div className="px-4 py-3 border-b border-slate-150 dark:border-slate-850 select-none">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-none">Sarah Jenkins</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-1">sarah.j@enterprise.io</p>
                    </div>

                    <div className="flex flex-col py-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onNavigate('users');
                        }}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg text-left w-full cursor-pointer"
                      >
                        <UserIcon className="h-3.8 w-3.8 text-slate-400" /> Profiles & Accounts
                      </button>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg text-left w-full cursor-pointer"
                      >
                        <Settings className="h-3.8 w-3.8 text-slate-400" /> Security Settings
                      </button>
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg text-left w-full cursor-pointer"
                      >
                        <HelpCircle className="h-3.8 w-3.8 text-slate-400" /> Help Support
                      </button>
                    </div>

                    <div className="border-t border-slate-150 dark:border-slate-850 p-1">
                      <button
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-955 hover:text-rose-600 rounded-lg text-left cursor-pointer"
                      >
                        <LogOut className="h-3.8 w-3.8" /> Sign Out Session
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </nav>
  );
}
