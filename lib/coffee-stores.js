import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_API_KEY,
});

export const defaultImage =
  'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80';

const options = {
  headers: {
    Authorization: process.env.NEXT_PUBLIC_FORESQUARE_API_KEY,
  },
};

const getUrlForCoffeeStores = (latLong, limit, query) => {
  return `https://api.foursquare.com/v3/places/search?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getCoffeeStorePhoto = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee',
    perPage: 10,
  });

  const unsplashResults = photos.response.results;

  const photosResponse = unsplashResults.map((res) => res.urls.small);

  return photosResponse;
};

export const fetchCoffeeStores = async (latLong = '40.7202049,-74.0138627') => {
  try {
    const photos = await getCoffeeStorePhoto();

    const data = await fetch(
      getUrlForCoffeeStores(latLong, 6, 'coffee'),
      options
    );

    if (!data) return [];

    const coffeeStores = await data.json();

    return coffeeStores?.results?.map((store, idx) => ({
      // ...store,
      address: store.location.address,
      fsq_id: store.fsq_id,
      name: store.name,
      neighborhood: store.location.neighborhood,
      imgUrl: photos[idx],
    }));
  } catch (error) {
    return [];
  }
};
