import { Router } from "express";

import { Film } from "../types";

const router = Router();

const defaultFilms: Film[] = [
    {
        id: 1,
        title: "Alien",
        director: "Ridley Scott",
        duration: 116,
    },
    {
        id: 2,
        title: "The thing",
        director: "Jhon Carpenter",
        duration: 109,
    },
    {
        id: 3,
        title: "Leon",
        director: "Luc Besson",
        duration: 110,
    }
];

router.get("/", (_req, res) => {
    const films = defaultFilms;
    return res.json(films);
});

export default router;