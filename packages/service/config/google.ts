import path from 'path'
import { GoogleAuthOptions } from 'google-auth-library'

export const credentials: GoogleAuthOptions = {
    keyFile: path.join(__dirname, '../', 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
}

type SpreadsheetType = () => {
    spreadsheetId: string,
    spreadsheetUrl: string,
}

export const spreadsheet: SpreadsheetType = () => require('../sheet-data.json')