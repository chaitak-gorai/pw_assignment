import Joi from 'joi'
import User from '../models/User.js'
import { GenerateResponse } from '../utils/responseCreator.js'
import generateToken from '../utils/generateToken.js'

const register = async (req, res) => {
  try {
    //validate request
    const registerReqSchema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    })
    const { error } = registerReqSchema.validate(req.body)
    if (error) {
      return GenerateResponse(res, 400, {}, error.details[0].message)
    }

    const { userName, password } = req.body
    const userExists = await User.findOne({ userName })
    if (userExists) {
      return GenerateResponse(res, 400, {}, 'User Already Exists')
    }
    const user = await User.create({ userName, password })

    if (user) {
      return GenerateResponse(res, 200, { user }, 'User Created Successfully')
    }
    return GenerateResponse(res, 400, {}, 'Unable to Create User')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}
const login = async (req, res) => {
  try {
    const loginReqSchema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    })
    const { error } = loginReqSchema.validate(req.body)
    if (error) {
      return GenerateResponse(res, 400, {}, error.details[0].message)
    }

    const { userName, password } = req.body
    const user = await User.findOne({ userName })
    if (!user) {
      return GenerateResponse(res, 400, {}, 'User Does Not Exists')
    }
    const isPasswordCorrect = await user.matchPassword(password)
    if (!isPasswordCorrect) {
      return GenerateResponse(res, 400, {}, 'Invalid Password')
    }
    const token = generateToken(user._id)
    if (token) {
      return GenerateResponse(
        res,
        200,
        { token },
        'User Logged In Successfully'
      )
    }
    return GenerateResponse(res, 400, {}, 'Unable to Login User')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}

export { register, login }
