// Components
export { MaterialIcon } from './components/MaterialIcon';
export { Header } from './components/Header';
export { Footer } from './components/Footer';
export { BottomNav } from './components/BottomNav';
export { PropertyCard } from './components/PropertyCard';
export { CategoryCard } from './components/CategoryCard';

// Data
export {
  featuredListings,
  browseListings,
  allProperties,
  getPropertyById,
  categories,
  dashboardStats,
  myListings,
  newLeads,
  chatConversations,
} from './data/mockData';
// Hooks
export { useSavedProperties } from './hooks/useSavedProperties';

// Context
export { AuthProvider, useAuth } from './context/AuthContext';
export { supabase } from './lib/supabaseClient';
