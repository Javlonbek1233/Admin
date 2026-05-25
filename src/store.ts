import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { User, Product, Order, Notification, ActivityEvent, CalendarEvent, DashboardStats } from './types';
import {
  initialUsers,
  initialProducts,
  initialOrders,
  initialNotifications,
  initialActivityEvents,
  initialCalendarEvents,
  initialStats,
} from './mockData';

// --- THEME SLICE ---
const themeSlice = createSlice({
  name: 'theme',
  initialState: { darkMode: true }, // Defaulting to sleek enterprise dark mode as requested
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

// --- USERS SLICE ---
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: initialUsers },
  reducers: {
    addUser: (state, action: PayloadAction<Omit<User, 'id' | 'joinDate' | 'lastActive'>>) => {
      const newId = `USR-${Math.floor(100 + Math.random() * 900)}`;
      const newUser: User = {
        ...action.payload,
        id: newId,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just registered',
      };
      state.list.unshift(newUser);
    },
    editUser: (state, action: PayloadAction<User>) => {
      const idx = state.list.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = action.payload;
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((u) => u.id !== action.payload);
    },
    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const user = state.list.find((u) => u.id === action.payload);
      if (user) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
      }
    },
  },
});

// --- PRODUCTS SLICE ---
const productsSlice = createSlice({
  name: 'products',
  initialState: { list: initialProducts },
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id' | 'ordersCount' | 'status'>>) => {
      const newId = `PROD-${Math.floor(300 + Math.random() * 699)}`;
      const status = action.payload.stock === 0 ? 'Out of Stock' : action.payload.stock <= 10 ? 'Low Stock' : 'In Stock';
      const newProduct: Product = {
        ...action.payload,
        id: newId,
        ordersCount: 0,
        status,
      };
      state.list.unshift(newProduct);
    },
    editProduct: (state, action: PayloadAction<Product>) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        const prod = action.payload;
        prod.status = prod.stock === 0 ? 'Out of Stock' : prod.stock <= 10 ? 'Low Stock' : 'In Stock';
        state.list[idx] = prod;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
});

// --- ORDERS SLICE ---
const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: initialOrders },
  reducers: {
    addOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'date'>>) => {
      const newId = `ORD-${Math.floor(7500 + Math.random() * 500)}`;
      const newOrder: Order = {
        ...action.payload,
        id: newId,
        date: new Date().toISOString().split('T')[0],
      };
      state.list.unshift(newOrder);
    },
    updateOrderStatus: (
      state,
      action: PayloadAction<{ id: string; status: Order['status'] }>
    ) => {
      const order = state.list.find((o) => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    deleteOrder: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((o) => o.id !== action.payload);
    },
  },
});

// --- NOTIFICATIONS SLICE ---
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { list: initialNotifications },
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotif: Notification = {
        ...action.payload,
        id: `NOT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        read: false,
      };
      state.list.unshift(newNotif);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.list.find((n) => n.id === action.payload);
      if (item) {
        item.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.list.forEach((n) => {
        n.read = true;
      });
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
  },
});

// --- ACTIVITIES SLICE ---
const activitiesSlice = createSlice({
  name: 'activities',
  initialState: { list: initialActivityEvents },
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<ActivityEvent, 'id' | 'time'>>) => {
      const newEvent: ActivityEvent = {
        ...action.payload,
        id: `ACT-${Math.floor(900 + Math.random() * 900)}`,
        time: 'Just now',
      };
      state.list.unshift(newEvent);
    },
  },
});

// --- CALENDAR SLICE ---
const calendarSlice = createSlice({
  name: 'calendar',
  initialState: { list: initialCalendarEvents },
  reducers: {
    addCalendarEvent: (state, action: PayloadAction<Omit<CalendarEvent, 'id'>>) => {
      const newEvent: CalendarEvent = {
        ...action.payload,
        id: `EVT-${Math.floor(10 + Math.random() * 90)}`,
      };
      state.list.push(newEvent);
    },
    deleteCalendarEvent: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((e) => e.id !== action.payload);
    },
  },
});

// --- GLOBAL SEARCH STATE ---
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    isOverlayOpen: false,
    query: '',
  },
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    toggleSearchOverlay: (state) => {
      state.isOverlayOpen = !state.isOverlayOpen;
    },
    setSearchOverlayOpen: (state, action: PayloadAction<boolean>) => {
      state.isOverlayOpen = action.payload;
    },
  },
});

// --- STATS SLICE ---
const statsSlice = createSlice({
  name: 'stats',
  initialState: { data: initialStats },
  reducers: {
    // Dynamic updates simulates transactions
    processTransactionalSale: (state, action: PayloadAction<number>) => {
      state.data.totalRevenue.value += action.payload;
      state.data.totalSales.value += 1;
      // Append some numbers to sparkline series
      state.data.totalRevenue.series.shift();
      state.data.totalRevenue.series.push(Number((state.data.totalRevenue.value / 1000).toFixed(2)));
    },
  },
});

// --- STORE SETUP ---
export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    users: usersSlice.reducer,
    products: productsSlice.reducer,
    orders: ordersSlice.reducer,
    notifications: notificationsSlice.reducer,
    activities: activitiesSlice.reducer,
    calendar: calendarSlice.reducer,
    search: searchSlice.reducer,
    stats: statsSlice.reducer,
  },
});

// Actions export
export const { toggleTheme, setTheme } = themeSlice.actions;
export const { addUser, editUser, deleteUser, toggleUserStatus } = usersSlice.actions;
export const { addProduct, editProduct, deleteProduct } = productsSlice.actions;
export const { addOrder, updateOrderStatus, deleteOrder } = ordersSlice.actions;
export const { addNotification, markAsRead, markAllAsRead, clearNotification } = notificationsSlice.actions;
export const { addActivity } = activitiesSlice.actions;
export const { addCalendarEvent, deleteCalendarEvent } = calendarSlice.actions;
export const { setSearchQuery, toggleSearchOverlay, setSearchOverlayOpen } = searchSlice.actions;
export const { processTransactionalSale } = statsSlice.actions;

// Types export
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks typed
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
