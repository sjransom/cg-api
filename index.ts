import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import bcyrpt from "bcrypt"
import { v4 as uuidv4 } from "uuid"

import { User } from "./types"
import { authenticateToken, generateAccessToken } from "./utils"

const jwt = require("jsonwebtoken")

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

// mock db
const users: User[] = [
  {
    id: "42d00cd5-0bdf-4807-91f0-f679dc54dde7",
    username: "sjransom@gmail.com",
    password: "$2b$10$pOMCpmXxwDjEjYOG2UJGNu7FZUPIdMycAppWY6osnjnJ1EuW2vHTa", // testing123
  },
  {
    id: "d014eeef-1cf5-4873-abfd-abcfc56dfc48",
    username: "adamb12@outlook.com",
    password: "$2b$10$wINz1902rPDmHJPtLuKD1.gD2.aNyPf7m.yPOjwxdxT2TOCsWuMhu", // gorillas123
  },
]
let refreshTokens: string[] = []

// login to app
app.post("/login", async (req: Request, res: Response) => {
  const user = users.find((user: User) => user.username === req.body.username)
  if (user) {
    try {
      if (await bcyrpt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

        // push refresh token to array
        refreshTokens.push(refreshToken)
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
      } else {
        res.status(401).send()
      }
    } catch {
      res.status(500).send()
    }
  } else {
    return res.status(400).send("Cannot find user")
  }
})

// logout
app.delete("/logout", (req: Request, res: Response) => {
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.body.refreshToken
  )
  res.sendStatus(204)
})

// get a new accessToken using refreshToken
app.post("/token", (req: Request, res: Response) => {
  const refreshToken: string = req.body.refreshToken
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err: any, user: any) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({
        id: user.id,
        username: user.username,
        password: user.password,
      })
      res.json({ accessToken: accessToken })
    }
  )
})

// get user
app.get("/users", authenticateToken, (req: any, res: Response) => {
  const filteredUser = users.filter((user) => user.id === req.user.id)
  res.json(filteredUser.map((user) => user.username))
})

// add new user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcyrpt.hash(req.body.password, 10)
    const user = {
      id: uuidv4(),
      username: req.body.username,
      password: hashedPassword,
    }
    users.push(user)
    res.status(201).send(users)
  } catch {
    res.status(500).send()
  }
})

app.listen(port)
