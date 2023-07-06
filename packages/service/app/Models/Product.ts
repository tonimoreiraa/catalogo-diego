import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, beforeCreate, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
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

  @column()
  public cost: number

  @column()
  public costCurrency: string

  @column()
  public tax: number

  @column()
  public tags: string[]
  
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public getPrice(dolar: number)
  {
    if (!this.tax) return 0
    return Number(this.cost)*dolar*(1 + Number(this.tax)/100)
  }

  // @beforeCreate()
  // public static async createCategory(product: Product)
  // {
  //   const category = await Category.updateOrCreate({name: product.type}, {name: product.type})
  //   product.categoryId = category.id

  //   return product
  // }
}