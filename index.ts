import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import bcyrpt from "bcrypt"
import { User } from "./types"
import { authenticateToken } from "./utils"

const jwt = require("jsonwebtoken")

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

const users: User[] = []

app.get("/users", authenticateToken, (req: any, res: Response) => {
  const filteredUser = users.filter((user) => user.name === req.user.name)
  res.json(filteredUser.map((user) => user.name))
})

app.post("/users", async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcyrpt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send(users)
  } catch {
    res.status(500).send()
  }
})

app.post("/login", async (req: Request, res: Response) => {
  const user = users.find((user: User) => (user.name = req.body.name))
  if (user) {
    try {
      if (await bcyrpt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.json({ accessToken: accessToken })
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

// app.post("/login", (req, res) => {
//   const username = req.body.name
//   const user = { name: username }

//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//   res.json({ accessToken: accessToken })
// })

app.listen(port)
