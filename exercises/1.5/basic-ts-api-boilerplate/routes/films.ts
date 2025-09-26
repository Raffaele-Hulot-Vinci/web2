import { Router } from "express";

//import path from "node:path";
import { Film } from "../types";
import { NewFilm } from "../types";

const router = Router();

const films: Film[] = [
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


router.get("/", (req, res) => {
    const ffilms = films;
    
    if(!req.query["minimum-duration"]){
        return res.json(ffilms);
    }

    if(Number(req.query["minimum-duration"]) <= 0){
        res.status(400).send("minimum film duration must be strictly positive");
    }
    
    const FilteredFilms = ffilms.filter((film) => {
        return film.duration >= Number(req.query["minimum-duration"]);
    });
    
    return res.json(FilteredFilms);
});

router.get("/:id", (req, res) => {
    if(Number(req.params.id) <= 0){
        res.status(400).send("list starts at 1");
    }
    const film = films[Number(req.params.id)-1];

    return res.json(film);
});

router.post("/", (req, res) => {
    const body: unknown = req.body;

    if(
        !body || 
        typeof body !== "object" || 

        !("title" in body) || 
        typeof body.title !== "string" || 
        !body.title.trim() || 

        !("director" in body) || 
        typeof body.director !== "string" || 
        !body.title.trim()
    ){
        return res.status(400).send("title and director must be present");
    }

    if(inFilms(body.title, body.director)){
        return res.status(409).send("film already listed");
    }

    if(
        !("duration" in body) || 
        typeof body.duration !== "number" || 
        body.duration <= 0
    ){
        return res.status(400).send("duration must be positive and present");
    }
    if(
        ("budget" in body) && (
            typeof body.budget !== "number" || 
            body.budget <= 0
        )
    ){
        return res.status(400).send("budget must be a positive but may be omitted");
    }


    const nextId = films.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;
    const { title, director, duration} = body as NewFilm;

    const newFilm: Film = {
        id: nextId,
        title: title,
        director: director,
        duration: duration
    };

    films.push(newFilm);

    return res.json(newFilm);
});

function inFilms(title: string, director: string) {
    for(let i=0; i<films.length; i++){
        if(films[i].title == title && films[i].director == director){
            return true;
        }
    }
    return false;
}

export default router;
