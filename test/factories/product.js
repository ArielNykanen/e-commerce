const faker = require('faker');
const Product = require('../../models/product');
/**
 * Generate an object which container attributes needed
 * to successfully create a product instance.
 * 
 * @param  {Object} props Properties to use for the product.
 * 
 * @return {Object}       An object to build the product from.
 */

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.name.title(),
    price: faker.commerce.price(),
    description: faker.name.jobDescriptor(),
    imageUrl: faker.image.imageUrl(),
  };
  return Object.assign({}, defaultProps, props);
};

/**
 * Generates a product instance from the properties provided.
 * 
 * @param  {Object} props Properties to use for the product.
 * 
 * @return {Object}       A product instance
 */

module.exports = async (props = {}) =>
  Product.create(await data(props));

