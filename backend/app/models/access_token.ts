// app/models/access_token.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class AccessToken extends BaseModel {
  @column({ isPrimary: true })
  id!: number

  @column()
  userId!: number

  @column()
  token!: string

  @column()
  type!: string

  @column.dateTime()
  expiresAt!: DateTime | null

  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @belongsTo(() => User)
  user!: BelongsTo<typeof User>
}
