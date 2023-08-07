import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from '../../Models/Product'
import TaxesController from './TaxesController'
const csvSeparator = ';'
import fs from 'fs/promises'
import {parse as csvParser} from 'csv-parse/sync'
import { bind } from '@adonisjs/route-model-binding'
export default class ProductsController {

    async export({response}: HttpContextContract)
    {
        const products = await Product.all()
        const dolar = await new TaxesController().getCurrentDolar()

        const data = products.map(product => ({
            ...product.serialize({fields: {omit: ['cost', 'tax', 'created_at', 'updated_at']}}),
            cost: product.cost,
            tax: product.tax,
            dolar: dolar.toFixed(2),
            price: product.getPrice(dolar)
        }))
        
        const csv = [Object.keys(data[0]).join(csvSeparator), ...data.map(p => Object.values(p).join(csvSeparator))].join('\n')

        return response.header('content-type', 'text/csv').send(csv)
    }

    async import({response, request}: HttpContextContract)
    {
        const file = request.file('data', {extnames: ['csv']})

        if (file && file.tmpPath) {
            const data: any = csvParser((await fs.readFile(file.tmpPath)).toString('utf-8'), {
                columns: true,
                skip_empty_lines: true,
            })
            .map(record => Object.fromEntries(Object.entries(record).filter(entry => entry[1] != '' && !/dolar|price/.test(entry[0]))))

            const products = await Product.updateOrCreateMany('id', data)

            return products.map(product => product.serialize())
        }

        return response.badRequest({message: 'Arquivo inválido.'})
    }

    async recu({response, request}: HttpContextContract)
    {
        const file = request.file('data', {extnames: ['csv']})

        if (file && file.tmpPath) {
            const data: any = csvParser((await fs.readFile(file.tmpPath)).toString('utf-8'), {
                columns: true,
                skip_empty_lines: true,
            })
            .map(record => Object.fromEntries(Object.entries(record).filter(entry => entry[1] != '' && !/dolar|price/.test(entry[0]))))

            for (const entry of data) {
                const product = await Product.query()
                    .where('identifier', entry.identifier)
                    .first()
                if (product && entry.tax) {
                    product.tax = entry.tax
                    await product.save()
                }
            }
        }

        return response.badRequest({message: 'Arquivo inválido.'})
    }

    async index({request}: HttpContextContract)
    {
        const dolar = await new TaxesController().getCurrentDolar()
        const page = request.input('page', 1)
        const perPage = request.input('perPage', 25)
        const categoryId = request.input('categoryId')
        const brandId = request.input('brandId')
        const queryString = request.input('query')
        const sqlQuery = '%'+queryString+'%'
        
        const products = await Product.query()
            .preload('images')
            .preload('category')
            .orderBy('createdAt', 'desc')
            .if(brandId, query => query.where('brandId', brandId))
            .if(categoryId, query => query.where('categoryId', categoryId))
            .if(queryString, query => query.where('title', 'ILIKE', sqlQuery).orWhere('description', 'ILIKE', sqlQuery))
            .paginate(page, perPage)
        console.log(products)

        /* @ts-ignore */
        products.rows = products.rows.map(data => ({...data.serialize(), price: data.getPrice(dolar), price_currency: 'BRL'}))

        return products
    }

    @bind()
    async show({}: HttpContextContract, product: Product)
    {
        const dolar = await new TaxesController().getCurrentDolar()
        await product.load('category')
        await product.load('costs')
        await product.load('images')
        

        return {...product.serialize(), price: product.getPrice(dolar)}
    }

}
