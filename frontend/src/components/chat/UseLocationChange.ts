import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useLocationChange = (callback: any) => {
  const currentLocation = useLocation();
  const previousLocation = useRef(currentLocation);

  useEffect(() => {
    if (previousLocation.current !== currentLocation) {
      callback(currentLocation);
      previousLocation.current = currentLocation;
    }
  }, [currentLocation, callback]);
}

export default useLocationChange;
