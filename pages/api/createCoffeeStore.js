import { table, getRecords } from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method !== 'POST')
      return res.status(400).json({ message: 'Invalid method' });
    // find a record

    const { id, name, neighborhood, address, imgUrl, voting } = req.body;

    if (!id) return res.status(400).json({ message: 'Id is required' });

    const findCoffeeStoreRecord = await table
      .select({
        filterByFormula: `id="${id}"`,
      })
      .firstPage();

    if (findCoffeeStoreRecord.length) {
      const records = getRecords(findCoffeeStoreRecord);
      return res.status(200).json({
        coffeeStore: records,
      });
    }

    if (!name) return res.status(400).json({ message: 'Name is required' });

    // create a record
    const createCoffeeStoreRecord = await table.create([
      {
        fields: {
          id,
          name,
          address,
          neighborhood,
          imgUrl,
          voting: 0,
        },
      },
    ]);

    const coffeeStore = getRecords(createCoffeeStoreRecord);

    return res.status(201).json({
      message: 'Record created',
      coffeeStore,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: 'Error creating or finding store',
    });
  }
};

export default createCoffeeStore;
