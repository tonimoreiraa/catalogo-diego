import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TaxRule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public minCost: number
  
  @column()
  public maxCost: number

  @column()
  public defaultTax: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
