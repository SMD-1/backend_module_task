export const success = (res, data = {}, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const error = (res, statusCode = 500, message = "Error", data = {}) => {
  return res.status(statusCode).json({ success: false, message, data });
};
