import { BaseCommand } from '@adonisjs/core/build/standalone'
import { credentials } from '../config/google'
import { google } from 'googleapis'
import { spreadsheet } from '../config/google'
import ProductCost from 'App/Models/ProductCost'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class SheetSync extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'sheet:sync'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call 
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run() {
    const auth = new google.auth.GoogleAuth(credentials)
    const sheets = google.sheets({ version: 'v4', auth })

    // Busca título das páginas do documento
    const { data: pagesData } = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheet.spreadsheetId,
      fields: 'sheets.properties.title',
    })
    const pages = pagesData.sheets?.map((sheet) => sheet.properties?.title)
    
    const costs = await ProductCost.query().preload('product')

    var providers = costs.map(product => product.source)
    providers = providers.filter((v, i) => providers.indexOf(v) == i)

    for (const provider of providers) {
      if (!pages?.includes(provider)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: spreadsheet.spreadsheetId,
          requestBody: {
            requests: [
              { addSheet: { properties: { title: provider } } },
            ],
          },
        })
      }
      const products = costs.filter(cost => cost.source == provider).map(product => ([product.product.title, product.product.type, provider, product.cost]))
      const data = [['Título', 'Marca', 'Fornecedor', 'Custo'], ...products]
      const range = `${provider}!A1:${String.fromCharCode(65 + data[0].length - 1)}${data.length}`

      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheet.spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {values: data},
      })
    }
  }
}
