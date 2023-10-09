import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const Auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res
        .status(400)
        .json({ success: false, message: 'Authorization header not found' })

    const authToken = (req.headers.authorization || '').split(' ')[1] || ''

    if (!authToken)
      return res
        .status(405)
        .json({ success: false, message: 'Authorization token not set' })

    const userCreds = jwt.verify(authToken, process.env.JWT_SECRET)
    console.log(userCreds)

    const user = await User.findById(userCreds.id)

    if (!user)
      return res
        .status(403)
        .json({ success: false, message: 'Authentication Failed' })

    req.body.user = user

    next()
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: 'Authentication failed' })
  }
}
