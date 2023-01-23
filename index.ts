import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.json())

const users: any = [] //fix type

app.get("/users", (req: Request, res: Response) => {
  res.json(users)
})

app.post("/users", (req: Request, res: Response) => {
  console.log(req.body.name, "req.body.name")
  const user = { name: req.body.name, password: req.body.password }
  users.push(user)
  res.status(201).send(users)
})

app.listen(port)
