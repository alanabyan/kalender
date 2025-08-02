import router from '@adonisjs/core/services/router'
const KalenderController = () => import('#controllers/kalenders_controller')
import { middleware } from '#start/kernel'
const AuthController = () => import('#controllers/auth_controller')

router.post('/login', [AuthController, 'login'])
router.get('/me', [AuthController, 'me'])

router.get('/api/kalender', [KalenderController, 'index'])
router.post('/api/kalender', [KalenderController, 'store'])

// router
//   .group(() => {
//     router.resource('/kalender', KalenderController).apiOnly()
//   })
//   .prefix('/api')
//   .use(middleware.auth())
