const responseType = {
  200: {
    success: true,
    httpStatus: 200,
    message: 'Successfully loaded data',
    type: 'OK',
  },
  400: {
    success: false,
    httpStatus: 400,
    message: 'Bad request',
    type: 'Bad request',
  },
  404: {
    success: false,
    httpStatus: 404,
    message: 'Request resource does not exist',
    type: 'Resource Does Not Exist',
  },
  500: {
    success: false,
    httpStatus: 500,
    message: 'An unknown error occurred',
    type: 'Server Error',
  },
}

const GenerateResponse = (res, code = 200, result = {}, message = '') => {
  let newMessage = message
  if (message === '') {
    newMessage = responseType[code].message
  }

  return res.status(responseType[code].httpStatus).json({
    success: responseType[code].success,
    result,
    msg: newMessage.toString(),
  })
}

export { GenerateResponse }
