import Product from "App/Models/Product";
import TaxRule from "App/Models/TaxRule";

export default async function SetTaxByRules()
{
    const rules = await TaxRule.all()

    const products = await Product.query()
        .whereNull('tax')

    for (const product of products) {
        const cost = Number(product.cost)
        const rule = rules.find(rule => (cost >= rule.minCost && (!rule.maxCost || cost <= rule.maxCost)))
        if (rule) {
            product.tax = rule.defaultTax
            await product.save()
        }
    }

}