import { Router } from "express";
import { Film } from "../types";
import { NewFilm } from "../types";
import { parse, serialize } from "../utils/json";

import path from "node:path";

const jsonDbPath = path.join(__dirname, "../data/films.json");

const router = Router();

const films: Film[] = [
    {
        id: 1,
        title: "memento",
        director: "Christopher Nolan",
        duration: 113,
    },
    {
        id: 2,
        title: "Willy's wonderland",
        director: "Kevin Lewis",
        duration: 88,
    },
    {
        id: 3,
        title: "alien",
        director: "Ridley Scott",
        duration: 117,
    },
];

router.get("/", (req, res) => {
    const ffilms = parse(jsonDbPath, films);

    if (!req.query["minimum-duration"]) {
        return res.json(ffilms);
    }

    if (Number(req.query["minimum-duration"]) <= 0) {
        res.status(400).send("minimum film duration must be strictly positive");
    }

    const FilteredFilms = ffilms.filter((film) => {
        return film.duration >= Number(req.query["minimum-duration"]);
    });

    return res.json(FilteredFilms);
});

router.get("/:id", (req, res) => {
    if (Number(req.params.id) <= 0) {
        res.status(400).send("list starts at 1");
    }
    const film = films[Number(req.params.id) - 1];

    return res.json(film);
});

router.post("/", (req, res) => {
    const body: unknown = req.body;

    if (
        !body ||
        typeof body !== "object" ||
        !("title" in body) ||
        typeof body.title !== "string" ||
        !body.title.trim() ||
        !("director" in body) ||
        typeof body.director !== "string" ||
        !body.title.trim()
    ) {
        return res.status(400).send("title and director must be present");
    }

    if (inFilms(body.title, body.director)) {
        return res.status(409).send("film already listed");
    }

    if (
        !("duration" in body) ||
        typeof body.duration !== "number" ||
        body.duration <= 0
    ) {
        return res.status(400).send("duration must be positive and present");
    }
    if (
        "budget" in body &&
        (typeof body.budget !== "number" || body.budget <= 0)
    ) {
        return res.status(400).send("budget must be a positive but may be omitted");
    }

    const ffilms = parse(jsonDbPath, films);

    const nextId = ffilms.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;

    const { title, director, duration, budget, description, imageURL } = body as NewFilm;

    const newFilm: Film = {
        id: nextId,
        title: title,
        director: director,
        duration: duration,
    };
    if(budget){
        newFilm.budget = budget;
    }
    if(description){
        newFilm.description = description;
    }
    if(imageURL){
        newFilm.imageURL = imageURL;
    }

    films.push(newFilm);
    serialize(jsonDbPath, ffilms);
    return res.json(newFilm);
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (id <= 0) {
        return res.status(400).send("list starts at 1");
    }

    const ffilms = parse(jsonDbPath, films);

    let delFilm;
    for (let index = 0; index < ffilms.length; index++) {
        if (ffilms[index].id == id) {
            delFilm = ffilms.splice(index, 1);
            serialize(jsonDbPath, ffilms);
            break;
        }
    }

    if (delFilm) {
        return res.json(delFilm);
    }

    return res.sendStatus(404);
});

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (id <= 0) {
        return res.status(400).send("list starts at 1");
    }

    const ffilms = parse(jsonDbPath, films);
    const film = ffilms.find((film) => film.id === id);
    if (!film) {
        return res.sendStatus(404);
    }

    const body: unknown = req.body;

    if (
        !body ||
        typeof body !== "object" ||
        ("title" in body &&
            (typeof body.title !== "string" || !body.title.trim())) ||
        ("director" in body &&
            (typeof body.director !== "string" || !body.director.trim())) ||
        ("description" in body &&
            (typeof body.description !== "string" || !body.description.trim())) ||
        ("imageURL" in body &&
            (typeof body.imageURL !== "string" || !body.imageURL.trim()))
    ) {
        return res.sendStatus(400);
    }

    if (
        ("duration" in body &&
            (typeof body.duration !== "number" || body.duration <= 0)) ||
        ("budget" in body && (typeof body.budget !== "number" || body.budget <= 0))
    ) {
        return res.status(400).send("duration and budget must be positives");
    }

    const {
        title,
        director,
        duration,
        budget,
        description,
        imageURL,
    }: Partial<NewFilm> = body;

    if (title) {
        film.title = title;
    }
    if (director) {
        film.director = director;
    }
    if (duration) {
        film.duration = duration;
    }
    if (budget) {
        film.budget = budget;
    }
    if (description) {
        film.description = description;
    }
    if (imageURL) {
        film.imageURL = imageURL;
    }

    serialize(jsonDbPath, ffilms);

    return res.json(film);
});

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (id <= 0) {
        return res.status(400).send("list starts at 1");
    }

    const body: unknown = req.body;
    if (
        !body ||
        typeof body !== "object" ||
        !("title" in body) ||
        typeof body.title !== "string" ||
        !body.title.trim() ||
        !("director" in body) ||
        typeof body.director !== "string" ||
        !body.title.trim()
    ) {
        return res.status(400).send("title and director must be present");
    }

    if (
        "imageURL" in body &&
        (typeof body.director !== "string" || !body.title.trim())
    ) {
        return res.sendStatus(400);
    }

    if (
        !("duration" in body) ||
        typeof body.duration !== "number" ||
        body.duration <= 0
    ) {
        return res.status(400).send("duration must be positive and present");
    }
    if (
        "budget" in body &&
        (typeof body.budget !== "number" || body.budget <= 0)
    ) {
        return res.status(400).send("budget must be a positive but may be omitted");
    }

    const ffilms = parse(jsonDbPath, films);

    const { title, director, duration, budget, description, imageURL } = body as Film;

    for (let i = 0; i < ffilms.length; i++) {
        if (ffilms[i].id == id) {
            const replaceFilm: Film = {
                id: id,
                title: title,
                director: director,
                duration: duration,
            };
            if (budget) {
                replaceFilm.budget = budget;
            }
            if (description) {
                replaceFilm.description = description;
            }
            if (imageURL) {
                replaceFilm.imageURL = imageURL;
            }
            ffilms[i] = replaceFilm;
            serialize(jsonDbPath, ffilms);
            return res.json(replaceFilm);
        }
    }

    const newFilm: Film = {
        id: id,
        title: title,
        director: director,
        duration: duration,
    };
    if (budget) {
        newFilm.budget = budget;
    }
                
    if (description) {
        newFilm.description = description;
    }
    if (imageURL) {
        newFilm.imageURL = imageURL;
    }
    
    ffilms.push(newFilm);
    serialize(jsonDbPath, ffilms);
    return res.json(newFilm);
});

function inFilms(title: string, director: string) {
    for (let i = 0; i < films.length; i++) {
        if (films[i].title == title && films[i].director == director) {
            return true;
        }
    }
    return false;
}

export default router;
