import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Tax from "App/Models/Tax";
import Category from 'App/Models/Category';
import { bind } from '@adonisjs/route-model-binding';
import CategoryTax from '../../Models/CategoryTax';

export default class TaxesController {

    async index()
    {
        const taxes = await Tax.query().orderBy('created_at')
        return taxes.map(tax => tax.serialize())
    }

    async store({request}: HttpContextContract)
    {
        const name = await request.input('name')
        
        const tax = await Tax.create({name})
        return tax.serialize()
    }

    @bind()
    async set({request}: HttpContextContract, tax: Tax, category: Category)
    {
        const value = request.input('value')
        const data = { taxId: tax.id, categoryId: category.id }
        const categoryTax = await CategoryTax.updateOrCreate(data, {...data, value})

        return categoryTax.serialize()
    }

    async setMany({request}: HttpContextContract) {

        const categories = request.input('categories')
        
        const resources: object[] = []
        for (const categoryId of Object.keys(categories)) {
            for (const taxId of Object.keys(categories[categoryId])) {
                resources.push({taxId, categoryId, value: categories[categoryId][taxId].value})
            }
        }

        const taxes = await CategoryTax.updateOrCreateMany(['categoryId', 'taxId'], resources)
        return taxes.map(tax => tax.serialize())
    }
}
