import { Request, Response, NextFunction } from "express"

const jwt = require("jsonwebtoken")

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]

  // if token null return 401
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(403)
    req.user = user
    next()
  })
}
