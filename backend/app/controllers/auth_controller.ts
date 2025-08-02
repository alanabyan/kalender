import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import AccessToken from '#models/access_token'
import hash from '@adonisjs/core/services/hash'
import { cuid } from '@adonisjs/core/helpers'
import { DateTime } from 'luxon'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { nama, password } = request.only(['nama', 'password'])

    const user = await User.query().where('nama', nama).first()
    if (!user) return response.unauthorized({ error: 'Nama tidak ditemukan' })

    const valid = await hash.verify(user.password, password)
    if (!valid) return response.unauthorized({ error: 'Password salah' })

    const token = cuid()
    await AccessToken.create({
      userId: user.id,
      token,
      type: 'bearer',
      expiresAt: DateTime.now().plus({ days: 7 }),
    })

    return response.ok({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    })
  }

  public async register({ request, response }: HttpContext) {
    const { nama, username, password } = request.only(['nama', 'username', 'password'])

    const existingUser = await User.query()
      .where('username', username)
      .orWhere('nama', nama)
      .first()
    if (existingUser) {
      return response.conflict({ error: 'Username atau nama sudah digunakan' })
    }

    const user = await User.create({
      nama,
      username,
      password: await hash.make(password),
      role: 'admin',
      gender: 'L',
    })

    return response.created({
      message: 'Akun berhasil dibuat',
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    })
  }

  public async me({ request, response }: HttpContext) {
    const auth = request.header('Authorization')?.replace('Bearer ', '').trim()
    if (!auth) return response.unauthorized({ error: 'Token tidak ada' })

    const access = await AccessToken.query().where('token', auth).preload('user').first()
    if (!access || (access.expiresAt && access.expiresAt < DateTime.now())) {
      return response.unauthorized({ error: 'Token tidak valid atau expired' })
    }

    return response.ok({
      id: access.user.id,
      nama: access.user.nama,
      username: access.user.username,
      role: access.user.role,
    })
  }
}
