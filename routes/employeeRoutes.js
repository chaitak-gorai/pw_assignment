import express from 'express'
import * as employeeController from '../controllers/employeeController.js'
import { GenerateResponse } from '../utils/responseCreator.js'
import { Auth } from '../middlewares/auth.js'

const router = express.Router()

router.get('/healthCheck', (req, res) => {
  return GenerateResponse(res, 200, {}, 'Employee Routes are Running')
})
router.post('/add', Auth, employeeController.addEmployee)
router.get('/all', Auth, employeeController.getAllEmployees)
router.post('/remove', Auth, employeeController.removeEmployee)
router.get('/entireSS', Auth, employeeController.entireSS)
router.get('/onContractSS', Auth, employeeController.onContractSS)
router.get('/allDepartmentSS', Auth, employeeController.allDepartmentSS)
router.get('/allSubDepartmentSS', Auth, employeeController.allSubDepartmentSS)

export default router
