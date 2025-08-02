import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddMJurusanIdToMKegiatanKalender extends BaseSchema {
  async up() {
    this.schema.alterTable('m_kegiatan_kalender', (table) => {
      table.integer('m_jurusan_id').unsigned().nullable().after('m_kelas_id')
    })
  }

  async down() {
    this.schema.alterTable('m_kegiatan_kalender', (table) => {
      table.dropColumn('m_jurusan_id')
    })
  }
}
