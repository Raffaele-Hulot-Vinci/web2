import { Router } from "express";
import path from "node:path";
import { serialize, parse } from "../utils/json";

import { Film } from "../types";

const router = Router();

const Films: Film[] = [
    {
        id: 1,
        title: "Alien",
        director: "Ridley Scott",
        duration: 117
    },
    {
        id: 2,
        title: "The Thing",
        director: "John Carpenter",
        duration: 109
    },
    {
        id: 3,
        title: "Le comte de Monte-Cristo",
        director: "Matthieu Delaporte",
        duration: 178,
    }
]

export default router;
