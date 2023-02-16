import { Request, Response, NextFunction } from "express"
import { User } from "./types"

const jwt = require("jsonwebtoken")

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]

  // if token null return 401
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: User) => {
    console.log(err, "error")
    if (err) return res.status(403).send("Access token has expired")
    req.user = user
    next()
  })
}

export const generateAccessToken = (user: User) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  })
}
