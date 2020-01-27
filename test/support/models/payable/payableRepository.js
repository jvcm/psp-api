const faker = require('faker');
const status = require('../../../../src/infra/database/enums/payable/status');

const statusArray = Object.keys(status);

const PayableRepository = () => ({
  id: faker.random.number(),
  value: faker.random.number(),
  status: statusArray[Math.floor(Math.random() * statusArray.length)],
  fee: faker.random.number(),
  paymentDate: faker.date.recent(),
  transactionId: faker.random.uuid(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
});

module.exports = PayableRepository;
