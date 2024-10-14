import { Router } from "express";
import { Film, NewFilm } from "../types";

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

router.get("/", (req, res) => {
    if(!Number(req.query["minimum-duration"])){
        return res.json(defaultFilms);
    }
    const duration = Number(req.query["minimum-duration"]);
    const filterfilms = defaultFilms.filter((film) => {
        return film.duration >= duration;
    });
    return res.json(filterfilms);
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const film = defaultFilms.find((film) => {
        film.id === id;
    });
    if(!film){
        return res.sendStatus(404);
    }
    return res.json(film);
});

router.post("/", (req, res) => {
    const body: unknown = req.body;
    if (
        !body ||
        typeof body !== "object" ||
        !("title" in body) ||
        !("director" in body) ||
        !("duration" in body) ||
        typeof body.title !== "string" ||
        typeof body.director !== "string" ||
        typeof body.duration !== "number" ||
        !body.title.trim() ||
        !body.director.trim() ||
        body.duration <= 0
    ){
        return res.sendStatus(400);
    }
  
    const {title, director, duration} = body as NewFilm;

    const nextId = defaultFilms.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) +1;

    const newFilm: Film = {
        id: nextId,
        title: title,
        director: director,
        duration: duration
    };

    defaultFilms.push(newFilm);
    return res.json(newFilm);
});

export default router;