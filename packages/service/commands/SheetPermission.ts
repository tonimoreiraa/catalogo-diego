import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import { google } from 'googleapis'
import { credentials } from '../config/google'
import { spreadsheet } from '../config/google'

export default class SheetPermission extends BaseCommand {

  @args.string()
  public emailAddress: string

  @args.string()
  public permission: string

  /**
   * Command name is used to run the command
   */
  public static commandName = 'sheet:permission'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Give permission to document'

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
    const drive = google.drive({ version: 'v3', auth })
    const s = spreadsheet()
    await drive.permissions.create({
      requestBody: {
        role: this.permission,
        type: 'user',
        emailAddress: this.emailAddress,
      },
      fileId: s.spreadsheetId,
      fields: 'id'
    })

    this.logger.info(`Permissão de "${this.permission}" concedida para ${this.emailAddress}. Acesse em ${s.spreadsheetUrl}.`)
  }
}
