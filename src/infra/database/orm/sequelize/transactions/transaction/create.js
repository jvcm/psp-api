const database = require('../../models');
const cardRepositoryDefault = require('../../../../../repositories/orm/sequelize/register/card/create');
const transactionRepositoryDefault = require('../../../../../repositories/orm/sequelize/transaction/create');
const payableRepositoryDefault = require('../../../../../repositories/orm/sequelize/payable/create');
const statusEnum = require('../../../../enums/transaction/status');

const create = (transactionRepository, cardRepository, payableRepository) => async (argCard,
  argTransaction, payable, infraVersion, env) => {
  const { sequelize } = database[infraVersion][env];

  let card;
  let transaction;
  await sequelize.transaction(() => cardRepository(argCard, infraVersion, env, true)
    .then((cardTemp) => {
      card = cardTemp.dataValues;
      return transactionRepository(argTransaction, card.id, infraVersion,
        env, true).then(async (transactionTemp) => {
        transaction = transactionTemp.dataValues;
        if (transaction.statusId === statusEnum.authorized) {
          return payableRepository(payable, transaction.id, infraVersion, env, true);
        }
        return null;
      });
    }));

  return {
    card,
    transaction,
  };
};

module.exports = {
  create: (arg1 = transactionRepositoryDefault, arg2 = cardRepositoryDefault,
    arg3 = payableRepositoryDefault) => create(arg1, arg2, arg3),
};
