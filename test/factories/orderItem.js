const faker = require('faker');
const model = require('../../models/order-item');
/**
 * Generate an object which container attributes needed
 * to successfully create a orderItem instance.
 * 
 * @param  {Object} props Properties to use for the orderItem.
 * 
 * @return {Object}       An object to build the orderItem from.
 */

const data = async (props = {}) => {
  const defaultProps = {
    quantity: faker.random.number()
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a orderItem instance from the properties provided.
 * 
 * @param  {Object} props Properties to use for the orderItem.
 * 
 * @return {Object}       A orderItem instance
 */

module.exports = async (props = {}) =>
  model.create(await data(props));

