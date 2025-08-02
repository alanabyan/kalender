import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class JurusanController {
  async index({ response }: HttpContext) {
    const data = await db.from('m_jurusan').select(['id', 'nama'])
    return response.ok(data)
  }

  async store({ request, response }: HttpContext) {
    const { nama, kode } = request.only(['nama', 'kode'])

    try {
      const [id] = await db.table('m_jurusan').insert({
        nama,
        kode,
        spp: 0,
        sumbangan_sarana_pendidikan: 0,
        kegiatan_osis: 0,
        mpls_jas_almamater: 0,
        seragam_sekolah: 0,
        toolkit_praktek: 0,
        m_sekolah_id: 12380,
        dihapus: 0,
        created_at: DateTime.now().toSQL({ includeOffset: false }),
        updated_at: DateTime.now().toSQL({ includeOffset: false }),
      })

      return response.created({ id, message: 'Jurusan berhasil ditambahkan' })
    } catch (error) {
      console.error('[POST JURUSAN ERROR]', error)
      return response.status(500).json({ error: 'Gagal menambahkan jurusan' })
    }
  }
}
