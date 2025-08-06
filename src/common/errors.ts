export const ERRORS = {
  USER_ALREADY_EXISTS: {
    message: 'User already exists',
    code: 1000,
    status: 409,
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    code: 1001,
    status: 404,
  },
  INVALID_CREDENTIALS: {
    message: 'Invalid credentials',
    code: 1002,
    status: 401,
  },
  FORBIDDEN_ROLE: {
    message: 'Forbidden role',
    code: 1003,
    status: 403
  },
  LOCATION_ALREADY_EXISTS: {
    message: 'Location already exists',
    code: 1004,
    status: 409,
  },
  LOCATION_NOT_FOUND: {
    message: 'Location not found',
    code: 1005,
    status: 404,
  },
  INTERNAL_SERVER_ERROR: {
    message: 'Internal server error',
    code: 500,
    status: 500,
  },
}