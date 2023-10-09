import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { GenerateResponse } from '../utils/responseCreator.js'

export const Auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      //   return res
      //     .status(400)
      //     .json({ success: false, message: 'Authorization header not found' })
      return GenerateResponse(res, 400, {}, 'Authorization header not found')

    const authToken = (req.headers.authorization || '').split(' ')[1] || ''

    if (!authToken)
      return GenerateResponse(res, 400, {}, 'Authorization token not found')

    const userCreds = jwt.verify(authToken, process.env.JWT_SECRET)

    const user = await User.findById(userCreds.id)

    if (!user)
      return GenerateResponse(res, 400, {}, 'User not found, Check Auth Token')

    req.body.user = user

    next()
  } catch (err) {
    return GenerateResponse(res, 500, {}, err.message)
  }
}
