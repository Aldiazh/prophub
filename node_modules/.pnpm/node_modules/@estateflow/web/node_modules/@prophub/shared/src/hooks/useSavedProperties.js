import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'prophub_saved_properties';

export function useSavedProperties() {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState([]);

  // Init local storage logic if no user
  useEffect(() => {
    if (!user) {
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) setSavedIds(JSON.parse(item));
      } catch (error) {
        console.warn('Error reading localStorage', error);
      }
    }
  }, [user]);

  // Fetch from Supabase if user exists
  useEffect(() => {
    if (!user) return;
    
    const fetchSaved = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_properties')
          .select('property_id')
          .eq('user_id', user.id);
          
        if (error) throw error;
        setSavedIds(data.map(d => d.property_id));
      } catch (err) {
        console.error('Error fetching saved properties:', err.message);
      }
    };
    
    fetchSaved();
  }, [user]);

  // Keep state synced with localStorage (only for guest)
  useEffect(() => {
    if (!user) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
        window.dispatchEvent(new Event('saved-properties-updated'));
      } catch (error) {
        console.warn('Error setting localStorage', error);
      }
    }
  }, [savedIds, user]);

  // Listen for changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      if (user) return; // ignore localstorage events if logged in
      try {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) setSavedIds(JSON.parse(item));
      } catch (error) {
        console.warn('Error reading localStorage', error);
      }
    };

    window.addEventListener('saved-properties-updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('saved-properties-updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const toggleSaved = async (id) => {
    const numericId = parseInt(id); // Ensure it's numeric for Supabase property_id
    
    // Optimistic UI update
    const isCurrentlySaved = savedIds.includes(numericId) || savedIds.includes(id);
    
    setSavedIds((prev) => {
      if (isCurrentlySaved) {
        return prev.filter((item) => item !== numericId && item !== id);
      } else {
        return [...prev, numericId];
      }
    });

    // Supabase sync
    if (user) {
      try {
        if (isCurrentlySaved) {
          await supabase.from('saved_properties').delete().match({ user_id: user.id, property_id: numericId });
        } else {
          await supabase.from('saved_properties').insert([{ user_id: user.id, property_id: numericId }]);
        }
      } catch (err) {
        console.error('Error toggling saved property in Supabase:', err.message);
      }
    }
  };

  const isSaved = (id) => {
    const numericId = parseInt(id);
    return savedIds.includes(id) || savedIds.includes(numericId) || savedIds.includes(String(id));
  };

  return { savedIds, toggleSaved, isSaved };
}
