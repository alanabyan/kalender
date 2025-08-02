// app/models/user.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import AccessToken from './access_token.js'

export default class User extends BaseModel {
  public static table = 'm_user'

  @column({ isPrimary: true })
  id!: number

  @column()
  nama!: string

  @column()
  username!: string

  @column()
  role!: string

  @column()
  gender!: string

  @column({ serializeAs: null })
  password!: string

  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt!: DateTime

  @hasMany(() => AccessToken)
  accessTokens!: HasMany<typeof AccessToken>
}
