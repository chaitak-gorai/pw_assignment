import express from 'express'
import * as userController from '../controllers/userController.js'
// import auth from '../middlewares/verifyToken.js'
import { GenerateResponse } from '../utils/responseCreator.js'
import { Auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/healthCheck', (req, res) => {
  return GenerateResponse(res, 200, {}, 'User Routes are Running')
})
router.post('/protected', Auth, userController.protectedRoute)

export default router
