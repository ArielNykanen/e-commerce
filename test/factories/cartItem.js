const faker = require('faker');
const model = require('../../models/cart-item');
/**
 * Generate an object which container attributes needed
 * to successfully create a cartItem instance.
 * 
 * @param  {Object} props Properties to use for the cartItem.
 * 
 * @return {Object}       An object to build the cartItem from.
 */

const data = async (props = {}) => {
  const defaultProps = {
    quantity: faker.random.number()
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a cartItem instance from the properties provided.
 * 
 * @param  {Object} props Properties to use for the cartItem.
 * 
 * @return {Object}       A cartItem instance
 */

module.exports = async (props = {}) =>
  model.create(await data(props));

