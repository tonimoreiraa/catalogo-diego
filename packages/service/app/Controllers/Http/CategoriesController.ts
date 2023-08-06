import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Category from "App/Models/Category";

export default class CategoriesController {

    async index({ request }: HttpContextContract) {
        const brandId = request.input('brandId')

        if (brandId) {
            return await Category.query().whereIn('id', (x) => {
                x.select('category_id')
                  .from('products')
                  .where('brand_id', brandId)
                  .distinct();
            })
        }
        const categories = await Category.query().orderBy('created_at').preload('taxes')
        return categories.map(category => category.serialize())
    }

}
