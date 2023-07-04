import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('category_id').nullable().references('categories.id')
      table.string('title').notNullable()
      table.string('type')
      table.string('identifier').notNullable()
      table.string('description')
      table.string('tags')

      table.decimal('cost', 10, 2)
      table.string('cost_currency')
      table.integer('tax')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
