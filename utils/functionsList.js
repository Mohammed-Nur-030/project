import data from './data'

const collections = data.custom_collections.map((c) => c.title)

export const functionsList = [
  {
    type: 'function',
    function: {
      name: 'fetchBabyProducts',
      description: `Gets list of some products in the store of types within  ${collections}...etc`,
      parameters: {
        type: 'object',
        properties: {
          productType: {
            type: 'string',
            description: `Type of products within ${collections}`,
          },
          limit: {
            type: 'integer',
            description: 'Limit of products to return, e.g. 1, 2, 37',
          },
        },

        required: ['products'],
      },
    },
  },
]

export const products = [
  {
    name: 'bata',
    category: 'shoes',
    price: 100,
  },
  {
    name: 'puma',
    category: 'shoes',
    price: 100,
  },
  {
    name: 'nike',
    category: 'shoes',
    price: 100,
  },
  {
    name: 'allen solly',
    category: 'shirts',
    price: 100,
  },
  {
    name: 'peter england',
    category: 'shirts',
    price: 100,
  },
  {
    name: 'levis',
    category: 'pants',
    price: 100,
  },
]
