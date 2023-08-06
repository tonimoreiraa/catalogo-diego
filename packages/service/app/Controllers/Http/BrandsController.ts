import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Brand from 'App/Models/Brand'

export default class BrandsController {
    
    async index({}: HttpContextContract)
    {
        const brands = await Brand.all()
        return brands.map(brand => brand.serialize())
    }

}
