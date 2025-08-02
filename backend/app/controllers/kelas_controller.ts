import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class KelasController {
  async index({ response }: HttpContext) {
    const data = await db.from('m_kelas').select(['id', 'nama', 'm_jurusan_id'])
    return response.ok(data)
  }

  async store({ request, response }: HttpContext) {
    const data = request.body()

    try {
      const now = DateTime.now().toSQL({ includeOffset: false })

      const payload = Array.isArray(data)
        ? data.map((kelas) => ({
            ...kelas,
            m_sekolah_id: 12380,
            dihapus: 0,
            created_at: now,
            updated_at: now,
          }))
        : [
            {
              ...data,
              m_sekolah_id: 12380,
              dihapus: 0,
              created_at: now,
              updated_at: now,
            },
          ]

      await db.table('m_kelas').insert(payload)

      return response.created({ message: 'Kelas berhasil ditambahkan' })
    } catch (error) {
      console.error('[POST KELAS ERROR]', error)
      return response.status(500).json({ error: 'Gagal menambahkan kelas' })
    }
  }
}
