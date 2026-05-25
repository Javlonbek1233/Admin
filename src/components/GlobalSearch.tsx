import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector, setSearchOverlayOpen, setSearchQuery } from '../store';
import { Command, Search, User as UserIcon, ShoppingBag, CreditCard, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GlobalSearchProps {
  onNavigate: (section: string, id?: string) => void;
}

export default function GlobalSearch({ onNavigate }: GlobalSearchProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.search.isOverlayOpen);
  const theme = useAppSelector((state) => state.theme.darkMode);
  
  const users = useAppSelector((state) => state.users.list);
  const products = useAppSelector((state) => state.products.list);
  const orders = useAppSelector((state) => state.orders.list);
  
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(setSearchOverlayOpen(true));
      }
      if (e.key === 'Escape') {
        dispatch(setSearchOverlayOpen(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleClose = () => {
    dispatch(setSearchOverlayOpen(false));
    setQuery('');
  };

  // Filter items
  const cleanQuery = query.toLowerCase().trim();
  const filteredUsers = cleanQuery
    ? users.filter((u) => u.name.toLowerCase().includes(cleanQuery) || u.email.toLowerCase().includes(cleanQuery) || u.role.toLowerCase().includes(cleanQuery))
    : [];

  const filteredProducts = cleanQuery
    ? products.filter((p) => p.name.toLowerCase().includes(cleanQuery) || p.sku.toLowerCase().includes(cleanQuery) || p.category.toLowerCase().includes(cleanQuery))
    : [];

  const filteredOrders = cleanQuery
    ? orders.filter((o) => o.id.toLowerCase().includes(cleanQuery) || o.customerName.toLowerCase().includes(cleanQuery))
    : [];

  const hasResults = filteredUsers.length > 0 || filteredProducts.length > 0 || filteredOrders.length > 0;

  const handleItemClick = (section: string, id?: string) => {
    handleClose();
    onNavigate(section, id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="search-overlay-container" className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            id="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            id="search-box-modal"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl mx-4"
          >
            {/* Input Bar */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-4">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search users, products, orders or type keys..."
                className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden font-medium text-base"
              />
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[380px] overflow-y-auto p-2">
              {!query ? (
                <div className="py-8 text-center">
                  <Command className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Search Spotlight</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Search users, warehouse products, or billing invoices.
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-4 px-2 py-1 bg-slate-50 dark:bg-slate-800/40 rounded-full inline-block">
                    Press <kbd className="font-mono">⌘K</kbd> or <kbd className="font-mono">Ctrl+K</kbd> to toggle
                  </p>
                </div>
              ) : !hasResults ? (
                <div className="py-8 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No results found for "{query}"</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Review your spelling or try another keyword.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-2">
                  {/* Users Category */}
                  {filteredUsers.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                        Team & Accounts ({filteredUsers.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {filteredUsers.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => handleItemClick('users', u.id)}
                            className="group flex items-center justify-between gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                              <div>
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                                  {u.name}
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">{u.email}</div>
                              </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
                              {u.role} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Category */}
                  {filteredProducts.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                        Products & Inventory ({filteredProducts.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {filteredProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => handleItemClick('products', p.id)}
                            className="group flex items-center justify-between gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <ShoppingBag className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-400">
                                  {p.name}
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">SKU: {p.sku} | {p.category}</div>
                              </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
                              ${p.price.toLocaleString()} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders Category */}
                  {filteredOrders.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 mb-1.5">
                        Billing & Orders ({filteredOrders.length})
                      </div>
                      <div className="flex flex-col gap-1">
                        {filteredOrders.map((o) => (
                          <div
                            key={o.id}
                            onClick={() => handleItemClick('orders', o.id)}
                            className="group flex items-center justify-between gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <CreditCard className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                                  {o.id} - {o.customerName}
                                </div>
                                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">Date: {o.date} &bull; {o.status}</div>
                              </div>
                            </div>
                            <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium font-mono">
                              ${o.amount.toLocaleString()} <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky footer info */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 px-4 py-2.5 text-[10px] text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <span>Navigate:</span>
                <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded-sm">↵ Enter</kbd>
              </span>
              <span>
                Close: <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 rounded-sm">Esc</kbd>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
