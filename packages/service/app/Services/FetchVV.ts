import axios from "axios"
import xlsx from 'node-xlsx';
import { JSDOM } from 'jsdom'
import Logger from '@ioc:Adonis/Core/Logger'
import Category from "App/Models/Category";
import { credentials, spreadsheet } from "../../config/google";
import { google } from "googleapis";
import Brand from "App/Models/Brand";
import Product from "App/Models/Product";
import ProductCost from "App/Models/ProductCost";

export async function FetchVV()
{
    const source = 'Visão Vip'
    const auth = new google.auth.GoogleAuth(credentials)
    const sheets = google.sheets({ version: 'v4', auth })
    const s = spreadsheet()

    const d = await sheets.spreadsheets.values.get({
        spreadsheetId: s.spreadsheetId,
        range: `Categoria!A1:Z100`,
    })

    const categoryNames = d.data.values?.filter(i => i[2] == source).map(i => i[1]) ?? []

    console.log(categoryNames)
    
    const main = await axios.get('https://www.visaovip.com/lista-preco')
    const dom = new JSDOM(main.data)
    /* @ts-ignore */
    const viewState = dom.window.document.querySelector('input[name="javax.faces.ViewState"]').value

    const body = "formProdutosListaPreco=formProdutosListaPreco&dtProdutosListaPreco_reflowDD=0_0&dtProdutosListaPreco%3Aj_idt89=&dtProdutosListaPreco_rppDD=20&dtProdutosListaPreco%3Aj_idt94%3Afilter=&dtProdutosListaPreco%3Aj_idt96%3Afilter=&dtProdutosListaPreco%3Aj_idt99_focus=&dtProdutosListaPreco%3Aj_idt99_input=&dtProdutosListaPreco%3Aj_idt104_focus=&dtProdutosListaPreco%3Aj_idt104_input=&dtProdutosListaPreco_rppDD=20&javax.faces.ViewState=" + viewState

    const {data} = await axios.post("https://www.visaovip.com/lista-preco", body, {
        headers: { cookie: main.headers["set-cookie"] },
        responseType: 'arraybuffer'
    })

    console.log(data.toString('utf-8'))
    
    const worksheet = xlsx.parse(data)
    const headers = worksheet[0].data[0]
    const entries = worksheet[0].data
        .slice(1)
        .map(entry => Object.fromEntries(entry.map((val, i) => [headers[i].toLowerCase(), val])))
    console.log(entries)
    
    for (const categoryName of categoryNames) {
        const category = await Category.updateOrCreate({name: categoryName}, {name: categoryName})
        const brand = await Brand.updateOrCreate({name: categoryName}, {name: categoryName})

        const categoryItems = entries.filter(entry => entry.nome.toLowerCase().includes(categoryName))
        Logger.info(`Carregando categoria ${categoryName} com ${categoryItems.length} itens de ${source}.`)
        const payload = categoryItems.map(item => ({
            identifier: 'vv-' + item.codigo,
            title: item.nome,
            type: categoryName,
            categoryId: category.id,
            cost: Number(item.valor.slice(3).replace('.', '').replace(',', '.')),
            costCurrency: 'USD',
            brandId: brand.id
        }))

        const products = await Product.updateOrCreateMany('identifier', payload)

        for (const product of products) {
            const productData = categoryItems.find(item => product.identifier.includes(item.codigo))
            const cost = Number(productData.valor.slice(3).replace('.', '').replace(',', '.'))
            const costData = { productId: product.id, currency: 'dolar', source: 'VisãoVip' }
            await ProductCost.updateOrCreate(costData, {...costData, cost})
        }
    }
}