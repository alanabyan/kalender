import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class KalendersController {
  async index({ request, response }: HttpContext) {
    const jurusanId = request.input('jurusanId') || request.input('m_jurusan_id')
    const kelasId = request.input('kelasId') || request.input('m_kelas_id')

    let query = db.from('m_kegiatan_kalender').select('*')

    if (jurusanId) {
      query = query.where('m_jurusan_id', jurusanId)
    }

    if (kelasId) {
      query = query.where('m_kelas_id', kelasId)
    }

    const data = await query
    return response.ok(data)
  }

  async store({ request, response }: HttpContext) {
    const {
      nama,
      tanggal_mulai,
      tanggal_akhir,
      waktu_mulai,
      waktu_akhir,
      m_jurusan_id,
      m_kelas_id,
    } = request.only([
      'nama',
      'tanggal_mulai',
      'tanggal_akhir',
      'waktu_mulai',
      'waktu_akhir',
      'm_jurusan_id',
      'm_kelas_id',
    ])

    try {
      const [id] = await db.table('m_kegiatan_kalender').insert({
        nama,
        tanggal_mulai,
        tanggal_akhir,
        waktu_mulai,
        waktu_akhir,
        m_jurusan_id,
        m_kelas_id,
        created_at: new Date(),
        updated_at: new Date(),
      })

      return response.created({ id, message: 'Jadwal berhasil ditambahkan' })
    } catch (error) {
      console.error('[POST KALENDER ERROR]', error)
      return response.status(500).json({ error: 'Gagal menambahkan jadwal' })
    }
  }
}
