export const LOCATION_DEFAULT = {
  latitude: 20.9935273,
  longitude: 105.8022073,
};

export const GOOGLE_API_KEY = 'YOUR_GOOGLE_MAP_API_KEY';

export const getAddressFromCurrentLocation = (lat, long) => {
  return new Promise((res, rej) => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_API_KEY}`;
    fetch(URL, {
      method: 'GET',
    })
      .then(data => data.json())
      .then(data => {
        if (data.results && data.results.length) {
          res({
            latitude: data?.results[0].geometry?.location.lat,
            longitude: data?.results[0].geometry?.location.lng,
            formatted_address: data?.results[0].formatted_address,
          });
        }
      })
      .catch(error => {
        return error;
      });
  });
};
