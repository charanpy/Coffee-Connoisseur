const AirTable = require('airtable');

const base = new AirTable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-stores');

const getRecords = (records) => {
  return records.map((record) => ({
    ...record.fields,
    recordId: record.id,
  }));
};

const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  if (findCoffeeStoreRecord.length) {
    return getRecords(findCoffeeStoreRecord);
  }
  return [];
};

export { table, getRecords, findRecordByFilter };
