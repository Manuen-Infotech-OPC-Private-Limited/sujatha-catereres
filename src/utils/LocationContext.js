import React, { createContext, useContext, useState, useCallback } from 'react';
import { checkCateringServiceable, checkMealboxServiceable } from './serviceability';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [locationState, setLocationState] = useState({
    latitude: null,
    longitude: null,
    pincode: null,
    isCateringServiceable: false,
    isMealboxServiceable: false,
    isLoading: false,
    error: null,
    permissionDenied: false,
  });

  const fetchPincode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'SujathaCaterersWeb/1.0',
          },
        }
      );
      const data = await response.json();
      const pincode = data.address?.postcode;
      return pincode || null;
    } catch (err) {
      console.error('Error fetching pincode:', err);
      return null;
    }
  };

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    setLocationState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const pincode = await fetchPincode(latitude, longitude);

        setLocationState({
          latitude,
          longitude,
          pincode,
          isCateringServiceable: checkCateringServiceable(pincode),
          isMealboxServiceable: checkMealboxServiceable(pincode),
          isLoading: false,
          error: null,
          permissionDenied: false,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Failed to get location.';
        let permissionDenied = false;
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission denied.';
          permissionDenied = true;
        }
        setLocationState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMsg,
          permissionDenied,
          isCateringServiceable: false,
          isMealboxServiceable: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const clearLocation = () => {
    setLocationState({
      latitude: null,
      longitude: null,
      pincode: null,
      isCateringServiceable: false,
      isMealboxServiceable: false,
      isLoading: false,
      error: null,
      permissionDenied: false,
    });
  };

  return (
    <LocationContext.Provider
      value={{
        ...locationState,
        requestLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
