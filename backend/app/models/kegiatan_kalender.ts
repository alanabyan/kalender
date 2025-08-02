// app/models/kegiatan_kalender.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class KegiatanKalender extends BaseModel {
  public static table = 'm_kegiatan_kalender'

  @column({ isPrimary: true })
  id!: number

  @column()
  nama!: string

  @column()
  deskripsi!: string | null

  @column.date()
  tanggalMulai!: DateTime

  @column()
  waktuMulai!: string | null

  @column.date()
  tanggalAkhir!: DateTime

  @column()
  waktuAkhir!: string | null

  @column()
  mSekolahId!: number

  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt!: DateTime

  @column()
  dihapus!: number
}
