import fetch from 'node-fetch'
import { requestOptions } from './shopify_init'
import data from './data'

// Fetch products from the Shopify API

const fetchBabyProducts = async (productType) => {
  const newProducts = []

  const collectionId = data.custom_collections.filter(
    (c) => c.title === productType
  )[0].id
  const shopifyApiUrl = `https://nanipk.myshopify.com/admin/api/2023-07/collections/${collectionId}/products.json`
  const fetchedProducts = fetch(shopifyApiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      // Handle the fetched products here
      const { products } = data
      console.log('products', products)
      products.map((product) => {
        newProducts.push({
          id: product.id,
          title: product.title,
          productType: product.product_type,
          image: product.images[0].src,
          handle: product.handle,
        })
      })
      return newProducts
    })
    .catch((error) => {
      console.error('Error fetching products:', error)
      return []
    })

  return fetchedProducts
}

export default fetchBabyProducts
