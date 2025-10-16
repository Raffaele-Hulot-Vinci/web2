import { Router } from "express";
import { Film } from "../types";
import { NewFilm } from "../types";

import {
    readAllFilms,
    findFilm,
    addFilm,
    inFilms,
    removeFilm,
    modFilm
} from "../services/films"

const router = Router();

router.get("/", (req, res) => {
    const minDuration = Number(req.query["minimum-duration"]);

    if(minDuration <= 0){
        return res.status(400).send("filter for minimum duration can't be negative");
    }
    const films = readAllFilms(minDuration);
    return res.json(films);
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (id <= 0) {
        return res.status(400).send("list starts at 1");
    }

    const film = findFilm(id);

    if(film){
        return res.json(film);
    }else{
        return res.sendStatus(404);
    }
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

    const { title, director, duration, budget, description, imageURL } = body as NewFilm;

    const newFilm = addFilm({ title, director, duration, budget, description, imageURL });

    return res.json(newFilm);
});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (id <= 0) {
        return res.status(400).send("list starts at 1");
    }

    const delFilm = removeFilm(id);

    if (delFilm) {
        return res.json(delFilm);
    }else{
        return res.sendStatus(404);
    }  
});

router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (id <= 0) {
        return res.status(400).send("list starts at 1");
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

    const film = modFilm(id, { title, director, duration, budget, description, imageURL });

    if(film){
        return res.json(film);
    }else{
        return res.status(404).send("the film you are trying to modify does not exist, check you inputted the correct id or try adding it instead");
    }
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

    const { title, director, duration, budget, description, imageURL } = body as Film;

    let film = modFilm(id, { title, director, duration, budget, description, imageURL });

    if(film){
        return res.json(film);
    }

    film = addFilm({ title, director, duration, budget, description, imageURL }, id);

    return res.json(film);
});

export default router;
