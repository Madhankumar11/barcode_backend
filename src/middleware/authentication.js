import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Authorization token is missing",
        data: "None"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Invalid authorization format",
        data: "None"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Invalid or expired token",
      data: "None"
    });
  }
};
