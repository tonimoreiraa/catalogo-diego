import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'

export default class ProductCost extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public source: string

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column()
  public currency: string

  @column()
  public cost: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
