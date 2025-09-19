import { Router } from "express";

//import path from "node:path";
import { Film } from "../types";

const router = Router();

const defaultFilms: Film[] = [
    {
        id: 1,
        title: "memento",
        director: "Christopher Nolan",
        duration: 113
    },
    {
        id: 2,
        title: "Willy's wonderland",
        director: "Kevin Lewis",
        duration: 88
    },
    {
        id: 3,
        title: "alien",
        director: "Ridley Scott",
        duration: 117
    }
];


router.get("/", (_req, res) => {
    const films = defaultFilms;

    return res.json(films)
});

export default router;
