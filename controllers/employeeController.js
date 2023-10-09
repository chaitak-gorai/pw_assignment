import Joi from 'joi'
import Employee from '../models/Employee.js'
import { GenerateResponse } from '../utils/responseCreator.js'

const addEmployee = async (req, res) => {
  try {
    //validate request
    const addEmployeeReqSchema = Joi.object({
      name: Joi.string().required(),
      salary: Joi.number().required(),
      currency: Joi.string(),
      department: Joi.string().required(),
      on_contract: Joi.boolean(),
      sub_department: Joi.string().required(),
      user: Joi.object().required(),
    })

    const { error } = addEmployeeReqSchema.validate(req.body)
    if (error) {
      return GenerateResponse(res, 400, {}, error.details[0].message)
    }

    const employee = await Employee.create(req.body)

    if (employee) {
      return GenerateResponse(
        res,
        200,
        { employee },
        'Employee Created Successfully'
      )
    }
    return GenerateResponse(res, 400, {}, 'Unable to Create Employee')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({})
    if (employees) {
      return GenerateResponse(
        res,
        200,
        { employees },
        'Employees Fetched Successfully'
      )
    }
    return GenerateResponse(res, 400, {}, 'Unable to Fetch Employees')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}

const removeEmployee = async (req, res) => {
  try {
    const removeEmployeeReqSchema = Joi.object({
      id: Joi.string().required(),
      user: Joi.object().required(),
    })
    const { error } = removeEmployeeReqSchema.validate(req.body)
    if (error) {
      return GenerateResponse(res, 400, {}, error.details[0].message)
    }
    const { id } = req.body

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return GenerateResponse(res, 400, {}, 'Invalid Employee Id')
    }
    const employee = await Employee.findByIdAndDelete(id)
    if (employee) {
      return GenerateResponse(res, 200, {}, 'Employee Deleted Successfully')
    }
    return GenerateResponse(res, 400, {}, 'Unable to Delete Employee')
  } catch (error) {
    return GenerateResponse(res, 500, {}, error.message)
  }
}

const entireSS = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
    ])
    console.log(result)
    if (result.length > 0) {
      const { avgSalary, minSalary, maxSalary } = result[0]
      return GenerateResponse(
        res,
        200,
        { avgSalary, minSalary, maxSalary },
        'SS Fetched Successfully'
      )
    } else {
      return GenerateResponse(res, 404, {}, 'No Employees Found')
    }
  } catch (err) {
    return GenerateResponse(res, 500, {}, err.message)
  }
}

const onContractSS = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $match: {
          on_contract: true,
        },
      },
      {
        $group: {
          _id: null,
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
    ])
    if (result.length > 0) {
      const { avgSalary, minSalary, maxSalary } = result[0]
      return GenerateResponse(
        res,
        200,
        { avgSalary, minSalary, maxSalary },
        'SS Fetched Successfully'
      )
    } else {
      return GenerateResponse(res, 404, {}, 'No Employees Found')
    }
  } catch (err) {
    return GenerateResponse(res, 500, {}, err.message)
  }
}

const allDepartmentSS = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
    ])
    if (result.length > 0) {
      return GenerateResponse(res, 200, { result }, 'SS Fetched Successfully')
    } else {
      return GenerateResponse(res, 404, {}, 'No Employees Found')
    }
  } catch (err) {
    return GenerateResponse(res, 500, {}, err.message)
  }
}

const allSubDepartmentSS = async (req, res) => {
  try {
    const result = await Employee.aggregate([
      {
        $group: {
          _id: {
            department: '$department',
            sub_department: '$sub_department',
          },
          avgSalary: { $avg: '$salary' },
          minSalary: { $min: '$salary' },
          maxSalary: { $max: '$salary' },
        },
      },
      {
        $group: {
          _id: '$_id.department',
          sub_departments: {
            $push: {
              sub_department: '$_id.sub_department',
              avgSalary: '$avgSalary',
              minSalary: '$minSalary',
              maxSalary: '$maxSalary',
            },
          },
        },
      },
    ])
    if (result.length > 0) {
      return GenerateResponse(res, 200, { result }, 'SS Fetched Successfully')
    } else {
      return GenerateResponse(res, 404, {}, 'No Employees Found')
    }
  } catch (err) {
    return GenerateResponse(res, 500, {}, err.message)
  }
}

export {
  addEmployee,
  getAllEmployees,
  removeEmployee,
  entireSS,
  onContractSS,
  allDepartmentSS,
  allSubDepartmentSS,
}
