"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
const users = [];
app.get("/users", (req, res) => {
    res.json(users);
});
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send(users);
    }
    catch (_a) {
        res.status(500).send();
    }
}));
app.post("/users/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = users.find((user) => (user.name = req.body.name));
    if (user) {
        try {
            if (yield bcrypt_1.default.compare(req.body.password, user.password)) {
                res.send("Success");
            }
            else {
                res.send("Not allowed");
            }
        }
        catch (_b) {
            res.status(500).send();
        }
    }
    else {
        return res.status(400).send("Cannot find user");
    }
}));
app.listen(port);
