import { useState, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/store-context';

const useLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  // const [latLong, setLatLong] = useState('');
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLong(`${latitude},${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LANG_LONG,
      payload: {
        latLong: `${latitude},${longitude}`,
      },
    });
    if (locationErrorMsg) {
      setLocationErrorMsg('');
    }
    setLoading((state) => !state);
  };

  const error = () => {
    setLoading((state) => !state);
    setLocationErrorMsg('Unable to retrieve your location');
  };

  const handleTrackLocation = () => {
    setLoading((state) => !state);
    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is supported by your browser');
      setLoading((state) => !state);

      return;
    }
    navigator.geolocation.getCurrentPosition(success, error);
  };

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMsg,
    loading,
  };
};

export default useLocation;
