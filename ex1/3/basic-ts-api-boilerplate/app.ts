import express from "express";

import usersRouter from "./routes/users";
import pizzaRouter from "./routes/pizzas";
import filmRouter from "./routes/films";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let getCounter = 0;
app.use((_req, _res, next) => {
    getCounter++;
    console.log("GET counter: " + getCounter);
    next();
});

app.use("/users", usersRouter);
app.use("/pizzas", pizzaRouter);
app.use("/films", filmRouter);

export default app;
