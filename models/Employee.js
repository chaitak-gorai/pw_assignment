import mongoose from 'mongoose'

const EmployeeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    on_contract: {
      type: Boolean,
    },
    sub_department: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Employee = mongoose.model('Employee', EmployeeSchema)
export default Employee
