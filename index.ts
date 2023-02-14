import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import bcyrpt from "bcrypt"
import { User } from "./types"
import { authenticateToken, generateAccessToken } from "./utils"
import { refreshTokens, users } from "./db"

const jwt = require("jsonwebtoken")

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

// login to app
app.post("/login", async (req: Request, res: Response) => {
  const user = users.find((user: User) => (user.username = req.body.username))
  if (user) {
    try {
      if (await bcyrpt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

        // push refresh token to array
        refreshTokens.push(refreshToken)
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
      } else {
        res.json({ message: "unauthorized" })
      }
    } catch {
      res.status(500).send()
    }
  } else {
    return res.status(400).send("Cannot find user")
  }
})

// get a new accessToken using refreshToken
app.post("/token", (req: Request, res: Response) => {
  const refreshToken: string = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({
        username: user.username,
        password: user.password,
      })
      res.json({ accessToken: accessToken })
    }
  )
})

// get user
app.get("/users", authenticateToken, (req: any, res: Response) => {
  const filteredUser = users.filter(
    (user) => user.username === req.user.username
  )
  res.json(filteredUser.map((user) => user.username))
})

// add new user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcyrpt.hash(req.body.password, 10)
    const user = { username: req.body.username, password: hashedPassword }
    users.push(user)
    res.status(201).send(users)
  } catch {
    res.status(500).send()
  }
})

app.listen(port)
