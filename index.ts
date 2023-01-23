import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import bcyrpt from "bcrypt"
import { User } from "./types"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

const users: User[] = []

app.get("/users", (req: Request, res: Response) => {
  res.json(users)
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

app.post("/users/login", async (req: Request, res: Response) => {
  const user = users.find((user: User) => (user.name = req.body.name))
  if (user) {
    try {
      if (await bcyrpt.compare(req.body.password, user.password)) {
        res.send("Success")
      } else {
        res.send("Not allowed")
      }
    } catch {
      res.status(500).send()
    }
  } else {
    return res.status(400).send("Cannot find user")
  }
})

app.listen(port)
