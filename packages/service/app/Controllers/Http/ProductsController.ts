import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'

export default class ProductsController {

    async index({}: HttpContextContract)
    {
        const products = await Product.query().preload('costs').preload('images')

        return products
    }

}
