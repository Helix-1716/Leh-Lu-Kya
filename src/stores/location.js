import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLocationStore = defineStore('location', () => {
  // Use sessionStorage to keep data only during the browser session
  const status = ref(sessionStorage.getItem('kuli-location-status') || 'prompt'); 
  const addressName = ref(sessionStorage.getItem('kuli-location-name') || 'Delhi Junction');
  const coords = ref(null);

  // Try to load saved coordinates from session
  const savedCoords = sessionStorage.getItem('kuli-location-coords');
  if (savedCoords) {
    try {
      coords.value = JSON.parse(savedCoords);
    } catch (e) {
      coords.value = null;
    }
  }

  const saveLocation = (lat, lon, name) => {
    coords.value = [lat, lon];
    addressName.value = name;
    status.value = 'granted';
    
    sessionStorage.setItem('kuli-location-status', 'granted');
    sessionStorage.setItem('kuli-location-name', name);
    sessionStorage.setItem('kuli-location-coords', JSON.stringify([lat, lon]));
  };

  const setDenied = () => {
    status.value = 'denied';
    sessionStorage.setItem('kuli-location-status', 'denied');
  };

  return { 
    status, 
    addressName, 
    coords, 
    saveLocation, 
    setDenied 
  };
});
