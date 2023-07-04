import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { google } from 'googleapis'
import { credentials } from '../config/google'
import fs from 'fs/promises'
import path from 'path'

export default class SheetCreate extends BaseCommand {

  @args.string()
  public title: string

  /**
   * Command name is used to run the command
   */
  public static commandName = 'sheet:create'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Create URL to a new Google Spreadsheet document'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest` 
     * afterwards.
     */
    loadApp: false,

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

    const title = this.title
    const document = await sheets.spreadsheets.create({
      requestBody: {
        properties: {title},
        sheets: [
          {
            properties: {title: 'Categoria'},
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {values: ['Categoria', 'Marca', 'Fornecedor', 'Nome de exibição'].map(stringValue => ({ userEnteredValue: { stringValue } }))}
                ]
              }
            ]
          }
        ]
      },
    })

    await fs.writeFile(path.join(__dirname, '../', 'sheet-data.json'), JSON.stringify(document.data))

    this.logger.info(`Sheet criado com sucesso! Acesse em ${document.data.spreadsheetUrl}.`)
  }
}
