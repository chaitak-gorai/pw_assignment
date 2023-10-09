import express from 'express'
import * as userController from '../controllers/userController.js'
import { GenerateResponse } from '../utils/responseCreator.js'
import { Auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/healthCheck', (req, res) => {
  return GenerateResponse(res, 200, {}, 'User Routes are Running')
})
router.post('/register', userController.register)
router.post('/login', userController.login)

export default router
