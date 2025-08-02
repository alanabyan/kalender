import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'm_kelas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nama').notNullable()
      table.string('kode').notNullable()
      table
        .integer('m_jurusan_id')
        .unsigned()
        .references('id')
        .inTable('m_jurusan')
        .onDelete('CASCADE')
      table.integer('m_sekolah_id').unsigned().notNullable()
      table.boolean('dihapus').defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
