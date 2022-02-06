import { findRecordByFilter, getRecords, table } from '../../lib/airtable';

const favoriteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method !== 'PUT')
      return res.status(404).json({ message: 'Invalid method' });
    const { id } = req.query;

    if (!id) return res.status(400).json({ message: 'Id is required' });

    const records = await findRecordByFilter(id);

    if (!records.length)
      return res.status(404).json({ message: 'Coffee Store not found' });

    const record = records[0];

    const calculateVoting = parseInt(record.voting) + 1;

    const updateCoffeeStore = await table.update([
      {
        id: record.recordId,
        fields: {
          voting: calculateVoting,
        },
      },
    ]);

    const coffeeStore = getRecords(updateCoffeeStore);
    return res.status(200).json({ coffeeStore });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error up voting' });
  }
};

export default favoriteCoffeeStoreById;
