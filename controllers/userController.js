import Joi from 'joi'
import User from '../models/User.js'
import { GenerateResponse } from '../utils/responseCreator.js'
import generateToken from '../utils/generateToken.js'

const register = async (req, res) => {
  try {
    const registerReqSchema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    })
    const { error } = registerReqSchema.validate(req.body)
    if (error) {
      return GenerateResponse(res, 400, {}, error.details[0].message)
    }
    console.log(req)
    const { userName, password } = req.body
    const userExists = await User.findOne({ userName })
    if (userExists) {
      return GenerateResponse(res, 400, {}, 'User Already Exists')
    }
    const user = await User.create({ userName, password })
    const token = generateToken(user._id)

    if (user) {
      return GenerateResponse(
        res,
        200,
        { user, token },
        'User Created Successfully'
      )
    }
    return GenerateResponse(res, 400, {}, 'Unable to Create User')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}

const protectedRoute = async (req, res) => {
  try {
    return GenerateResponse(res, 200, {}, 'Protected Route Accessed')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}

export { register, protectedRoute }
