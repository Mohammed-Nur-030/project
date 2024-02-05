// Replace with your Shopify store's API credentials and endpoint
export const shopifyApiUrl =
  'https://nanipk.myshopify.com/admin/api/2023-07/products.json'
const apiKey = '20f26f95596def2ff7e233f15394b985'
export const password = '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'

// Create an authentication header
export const authHeader =
  'Basic ' + Buffer.from(apiKey + ':' + password).toString('base64')

// Set up the request options
export const requestOptions = {
  method: 'GET',
  headers: {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  },
}

// const url = "https://20f26f95596def2ff7e233f15394b985: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@nanipk.myshopify.com/admin/api/2023-07/products.json"
