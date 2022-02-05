import { fetchCoffeeStores } from '../../lib/coffee-stores';

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong } = req.query;

    const response = await fetchCoffeeStores(latLong);

    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default getCoffeeStoresByLocation;
