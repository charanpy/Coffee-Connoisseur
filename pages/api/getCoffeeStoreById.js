import { findRecordByFilter, getRecords, table } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.status(400).json({ message: 'Id is required' });

    const coffeeStore = await findRecordByFilter(id);

    return res.status(200).json({ coffeeStore });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to fetch coffee store',
    });
  }
};

export default getCoffeeStoreById;
