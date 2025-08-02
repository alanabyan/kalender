import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class CreateMKelasTable extends BaseSchema {
  protected tableName = 'm_kelas'

  async up() {
    this.schema.createTable(this.tableName, (table: Knex.CreateTableBuilder) => {
      table.increments('id') // Primary key
      table.string('nama_kelas').notNullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
