import { type SchemaTypeDefinition } from 'sanity'
import { promotionCode } from './schemas/promotion-code'
import { productCategory } from './schemas/product-category'
import { promotionCampaign } from './schemas/promotion-campaign'
import { product } from './schemas/products'
import { order, orderItem, shippingAddress } from './schemas/order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    promotionCode,
    productCategory,

    promotionCampaign,
    product,
    
     shippingAddress,
    orderItem,
    order,
  ],
}
