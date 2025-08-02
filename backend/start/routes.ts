import router from '@adonisjs/core/services/router'
const KalenderController = () => import('#controllers/kalenders_controller')
const AuthController = () => import('#controllers/auth_controller')
const KelasController = () => import('#controllers/kelas_controller')
const JurusanController = () => import('#controllers/jurusan_controller')

router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.get('/me', [AuthController, 'me'])

router.get('/api/kalender', [KalenderController, 'index'])
router.post('/api/kalender', [KalenderController, 'store'])

router.get('/kelas', [KelasController, 'index'])
router.post('/kelas', [KelasController, 'store'])

router.get('/jurusan', [JurusanController, 'index'])
router.post('/jurusan', [JurusanController, 'store'])

// router
//   .group(() => {
//     router.resource('/kalender', KalenderController).apiOnly()
//   })
//   .prefix('/api')
//   .use(middleware.auth())
