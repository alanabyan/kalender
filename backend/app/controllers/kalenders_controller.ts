import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class KalenderController {
  // GET /kalender?kelas_id=123
  async index({ request, response }: HttpContext) {
    try {
      const kelasId = request.qs().kelas_id

      const query = db
        .from('m_kegiatan_kalender')
        .select([
          'id',
          'nama',
          'deskripsi',
          'tanggal_mulai',
          'waktu_mulai',
          'tanggal_akhir',
          'waktu_akhir',
          'm_kelas_id',
          'm_sekolah_id',
          'created_at',
          'updated_at',
        ])
        .where('dihapus', 0)

      if (kelasId) {
        query.andWhere('m_kelas_id', kelasId)
      }

      const events = await query
      return response.ok({ events })
    } catch (error) {
      console.error('[GET KALENDER ERROR]', error)
      return response.status(500).json({ error: 'Gagal mengambil data kalender' })
    }
  }

  // POST /kalender
  async store({ request, response }: HttpContext) {
    try {
      const {
        title,
        description,
        start,
        end,
        m_kelas_id,
        m_sekolah_id = 12380,
      } = request.only(['title', 'description', 'start', 'end', 'm_kelas_id', 'm_sekolah_id'])

      const startDate = new Date(start)
      const endDate = new Date(end)

      const [id] = await db.table('m_kegiatan_kalender').insert({
        nama: title,
        deskripsi: description,
        tanggal_mulai: startDate,
        waktu_mulai: startDate.toTimeString().split(' ')[0],
        tanggal_akhir: endDate,
        waktu_akhir: endDate.toTimeString().split(' ')[0],
        m_kelas_id,
        m_sekolah_id,
        created_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        updated_at: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
        dihapus: 0,
      })

      return response.status(201).json({
        message: 'Jadwal berhasil ditambahkan',
        eventId: id,
      })
    } catch (error) {
      console.error('[POST KALENDER ERROR]', error)
      return response.status(500).json({ error: 'Gagal menambahkan jadwal' })
    }
  }
}
