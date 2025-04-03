// create a custom error with success, message, statusCode
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
