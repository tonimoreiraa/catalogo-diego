import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from '../../Models/Product'
import axios from 'axios'

export default class ProductsController {

    async index({request}: HttpContextContract)
    {
        var dolar = (await axios.get('https://economia.awesomeapi.com.br/last/USD-BRL')).data.USDBRL.ask
        dolar = dolar * (1.035)
        const taxId = request.input('taxId')

        const products = await Product.query().preload('costs').preload('images').preload('category', (query) => query.preload('taxes', tax => tax.preload('tax')))

        return products.map(product => {
            const taxes = product.category.taxes
            const deliveryTax = taxes.find(tax => tax.tax.name == 'Frete')?.value
            const tax = taxes.find(tax => tax.taxId == taxId)?.value
            const cost = product.costs[0]?.cost
            
            if (deliveryTax && cost && tax) {
                const baseCost = Number(cost) * dolar * ((Number(deliveryTax)/100) + 1)
                const finalCost = baseCost * ((Number(tax)/100) + 1)
                return {...product.serialize(), cost: Number(finalCost.toFixed(2)), costs: undefined}
            }

            return {...product.serialize(), costs: undefined}
        })
    }

}
