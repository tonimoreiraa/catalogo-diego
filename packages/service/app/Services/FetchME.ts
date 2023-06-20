import Category from "App/Models/Category";
import Product from "App/Models/Product";
import ProductCost from "App/Models/ProductCost";
import ProductImage from "App/Models/ProductImage";
import axios from "axios";

export async function FetchME()
{
    const source = 'mega-eletronicos'
    var products: any = []

    var response
    var p = 1
    while ((response && response.data.productos.length) || p == 1) {
        response = await axios.get('https://www.megaeletronicos.com:4420/newproductos/search', { params: {
            m: 325, s: 0, c: 0, d: 0, p,
            o: 'desc',
            st: 'all'
        }})
        products = [...products, ...response.data.productos]
        p++
    }

    for (const productData of products) {
        const texts = productData.textos[0].data
        const identifier = 'me-' + productData.codigo
        const exists = !!(await Product.findBy('identifier', identifier))
        const categoryData = {name: texts.nombre}
        const category = await Category.updateOrCreate(categoryData, categoryData)

        const product = await Product.updateOrCreate({ identifier }, {
            title: texts.titulo,
            type: texts.nombre,
            tags: texts.tags,
            identifier,
            categoryId: category.id
        })

        if (!exists) {
            await ProductImage.createMany(productData.imagenes.map(i => ({productId: product.id, image: i})))
        }

        const costData = { productId: product.id, currency: 'dolar', source }
        if (productData.stock) {
            await ProductCost.updateOrCreate(costData, {...costData, cost: productData.dolar,})
        } else {
            await ProductCost.query().delete()
            .where('productId', product.id)
            .where('currency', 'dolar')
            .where('source', source)
        }
    }
}