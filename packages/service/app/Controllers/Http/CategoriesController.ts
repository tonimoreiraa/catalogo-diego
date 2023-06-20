// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Category from "App/Models/Category";

export default class CategoriesController {

    async index() {
        const categories = await Category.query().orderBy('created_at').preload('taxes')
        return categories.map(category => category.serialize())
    }

}
