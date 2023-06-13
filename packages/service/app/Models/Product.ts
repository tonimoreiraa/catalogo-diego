import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import ProductCost from './ProductCost'
import ProductImage from './ProductImage'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @hasMany(() => ProductCost)
  public costs: HasMany<typeof ProductCost>
  
  @hasMany(() => ProductImage)
  public images: HasMany<typeof ProductImage>

  @column()
  public title: string

  @column()
  public categoryId: number

  @column()
  public identifier: string

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @column()
  public type: string

  @column()
  public description: string

  @column({
    prepare: (v) => JSON.stringify(v),
    serialize: (v) => JSON.parse(v)
  })
  public tags: string[]
  
  @column({
    prepare: (v) => JSON.stringify(v),
    serialize: (v) => JSON.parse(v)
  })
  public data: object

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
