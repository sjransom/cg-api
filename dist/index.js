"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
const users = []; //fix type
app.get("/users", (req, res) => {
    res.json(users);
});
app.post("/users", (req, res) => {
    console.log(req.body.name, "req.body.name");
    const user = { name: req.body.name, password: req.body.password };
    users.push(user);
    res.status(201).send(users);
});
app.listen(port);
