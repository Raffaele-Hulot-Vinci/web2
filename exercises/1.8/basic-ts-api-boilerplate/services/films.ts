import { Film } from "../types";
import { NewFilm } from "../types";
import { parse, serialize } from "../utils/json";

import path from "node:path";

const jsonDbPath = path.join(__dirname, "../data/films.json");

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

function readAllFilms(minDuration: number): Film[] {
    let ffilms = parse(jsonDbPath, films);

    if(minDuration){
        ffilms = ffilms.filter((film) => {
            return film.duration >= minDuration;
        });
    }

    return ffilms;
}

function findFilm(id: number): Film | undefined {
    const ffilms = parse(jsonDbPath, films);

    for (let i = 0; i < ffilms.length; i++) {
        if(ffilms[i].id == id){
            return ffilms[i];
        }
    }
    return undefined;
}

function inFilms(title: string, director: string): boolean {
    const ffilms = parse(jsonDbPath, films);

    for (let i = 0; i < ffilms.length; i++) {
        if (ffilms[i].title == title && ffilms[i].director == director) {
            return true;
        }
    }
    return false;
}

function addFilm(newFilm: NewFilm, id?: number): Film {
    const ffilms = parse(jsonDbPath, films);

    if(!id){
        id = ffilms.reduce((maxId, film) => (film.id > maxId ? film.id : maxId), 0) + 1;
    }

    const createdFilm = {
        id: id,
        ...newFilm
    }

    ffilms.push(createdFilm);
    serialize(jsonDbPath, ffilms);

    return createdFilm;
}

function removeFilm(id: number): Film | undefined {
    const ffilms = parse(jsonDbPath, films);

    for(let i = 0; i < ffilms.length; i++){
        if(ffilms[i].id == id){
            const film = ffilms[i];
            ffilms.splice(i, 1);
            serialize(jsonDbPath, ffilms);
            return film;
        }
    }
    return undefined;
}

function modFilm(id: number, upFilm: Partial<NewFilm>): Film | undefined {
    const ffilms = parse(jsonDbPath, films);
    const film = ffilms.find((film) => film.id === id);
    
    if(!film){
        return undefined;
    }

    if(upFilm.title){
        film.title = upFilm.title;
    }
    if(upFilm.director){
        film.director = upFilm.director;
    }
    if(upFilm.duration){
        film.duration = upFilm.duration;
    }
    film.budget = upFilm.budget;
    film.description = upFilm.description;
    film.imageURL = upFilm.imageURL;

    serialize(jsonDbPath, ffilms);

    return film;
}

export {
    readAllFilms,
    findFilm,
    addFilm,
    inFilms,
    removeFilm,
    modFilm
}