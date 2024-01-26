import Category from "App/Models/Category";
import Product from "App/Models/Product";
import ProductCost from "App/Models/ProductCost";
import ProductImage from "App/Models/ProductImage";
import { credentials, spreadsheet } from "../../config/google";
import axios from "axios";
import { google } from "googleapis";
import Logger from '@ioc:Adonis/Core/Logger'
import Brand from "App/Models/Brand";

export async function FetchME()
{
    const source = 'Mega Eletrônicos'
    const auth = new google.auth.GoogleAuth(credentials)
    const sheets = google.sheets({ version: 'v4', auth })
    const s = spreadsheet()

    const data = await sheets.spreadsheets.values.get({
        spreadsheetId: s.spreadsheetId,
        range: `Categoria!A1:Z100`,
    })
    
    /* @ts-ignore */  
    const brandNames = Object.fromEntries(data.data.values?.filter(item => item[2] == source).map(item => [Number(item[1]), item[3]]))

    const brands = Object.keys(brandNames)
    const productIDs: number[] = []

    for (const brandMeId of brands) {

        const brandName = brandNames[brandMeId]
        const brand = await Brand.updateOrCreate({name: brandName}, {name: brandName})

        Logger.info(`Importando marca: ${brandName} de ${source}`)
        var products: any = []
        var response
        var p = 1
        while ((response && response.data.productos.length) || p == 1) {
            response = await axios.get('https://www.megaeletronicos.com:4420/newproductos/search', { params: {
                m: brandMeId, s: 0, c: 0, d: 0, p,
                o: 'desc',
                st: 'all'
            }})
            products = [...products, ...response.data.productos]
            p++
        }

        for (const productData of products) {

            // busca textos do Mega Eletrônicos
            const texts = productData.textos.find(t => t.lang == 'pt').data
            const identifier = 'me-' + productData.codigo
            // verifica se já existe
            const exists = !!(await Product.findBy('identifier', identifier))
            
            const categoryData = brandMeId == '325' && !texts.nombre.toLowerCase().includes('apple') ? {name: 'Apple ' + texts.nombre.split(' ').filter(i => !/\d/.test(i)).slice(0,2).join(' ')} : {name: texts.nombre.split(' ').filter(i => !/\d/.test(i)).slice(0,3).join(' ')}
            const category = await Category.updateOrCreate(categoryData, categoryData)

            const product = await Product.updateOrCreate({ identifier }, {
                title: texts.titulo,
                type: texts.nombre,
                tags: texts.tags,
                identifier,
                categoryId: category.id,
                cost: productData.dolar,
                costCurrency: 'USD',
                brandId: brand.id
            })
            productIDs.push(product.id)

            if (!exists) {
                await ProductImage.createMany(productData.imagenes.map(i => ({productId: product.id, image: 'https://www.megaeletronicos.com:4420/img/'+ i.replace('/uploads/Product/', '').replaceAll('/', '-')})))
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
    await Product.query().delete().from('products')
        .where('identifier', 'LIKE', 'me-%')
        .andWhereNot('id', 'IN', productIDs)
}