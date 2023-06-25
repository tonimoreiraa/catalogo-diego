import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from '../../Models/Product'
import TaxesController from './TaxesController'

export default class ProductsController {

    async index({request, auth}: HttpContextContract)
    {
        const dolar = await new TaxesController().getCurrentDolar()
        const taxId = request.input('taxId')

        const products = await Product.query().preload('costs').preload('images').preload('category', (query) => query.preload('taxes', tax => tax.preload('tax')))

        return products.map(product => {
            const taxes = product.category.taxes
            const deliveryTax = taxes.find(tax => tax.tax.name == 'Frete')?.value
            const tax = taxes.find(tax => tax.taxId == taxId)?.value
            const cost = product.costs[0]?.cost
            const costs = auth.user ? product.costs.map(cost => ({
                ...cost.serialize(),
                cost: Number(cost.cost),
                finalCost: Number(cost.cost) * dolar * ((Number(deliveryTax)/100) + 1)
            })) : undefined
            const costsByTax = auth.user && cost ? Object.fromEntries(taxes.map(tax => {
                const baseCost = Number(cost) * dolar * ((Number(deliveryTax)/100) + (tax.tax.name == 'Frete' ? 0 : 1))
                const finalCost = baseCost * (tax.tax.name == 'Frete' ? 1 : ((Number(tax.value)/100) + 1))
                return [tax.tax.id, Number(finalCost.toFixed(2))]
            })) : undefined
            
            if (deliveryTax && cost && tax) {
                const baseCost = Number(cost) * dolar * ((Number(deliveryTax)/100) + 1)
                const finalCost = baseCost * ((Number(tax)/100) + 1)
                return {...product.serialize(), cost: Number(finalCost.toFixed(2)), costs}
            }

            return {...product.serialize(), costs, costsByTax}
        })
    }

}
