import { Router } from "express";
import { NewText } from "../types";
import {
    readAll,
    findById,
    addText,
    isValidLevel,
    levelsAsString,
    removeText,
    addTextWithId,
    modText
} from "../services/texts";

const router = Router();
const contentErrorMessage = "content may not be ommited and must be a string (text)";
const levelMissingErrorMessage = "level may not be ommited and must be one of the following:\n" + levelsAsString();

router.get("/", (req, res) => {
    let level = undefined;
    if(req.query["level"]){
        level = String(req.query["level"]);
    }

    if(level !== undefined && !isValidLevel(level)){
        const merror = "level can only be one of the following:\n" + levelsAsString();
        return res.status(400).send(merror);
    }
    
    const texts = readAll(level);
    return res.json(texts);
});

router.get("/:id", (req, res) => {
    const id = String(req.params.id);
    
    const text = findById(id);
    if(!text){
        return res.sendStatus(404);
    }
    return res.json(text);
});

router.post("/", (req, res) => {
    const body: unknown = req.body;

    if(
        !body ||
        typeof body !== "object"
    ){
        return res.sendStatus(400);
    }
    if(
        !("content" in body) ||
        typeof body.content !== "string"
    ){
        return res.status(400).send(contentErrorMessage);
    }
    if(
        !("level" in body) ||
        typeof body.level !== "string" ||
        !isValidLevel(body.level)
    ){
        return res.status(400).send(levelMissingErrorMessage);
    }

    let newText;
    const {content, level} = body as NewText;
    if("id" in body && typeof body.id === "string"){
        if(findById(body.id)){
            return res.status(400).send("id already in use");
        }
        newText = addTextWithId(body.id, content, level);
    }else{
        newText = addText(content, level);
    }

    return res.json(newText);
});

router.delete("/:id", (req, res) => {
    const id = String(req.params.id);

    const text = removeText(id);

    if(!text){
        return res.sendStatus(404);
    }
    return res.json(text);
});

router.put("/:id", (req, res) => {
    const body: unknown = req.body;

    if(
        !body ||
        typeof body !== "object"
    ){
        return res.sendStatus(400);
    }
    if(
        !("content" in body) ||
        typeof body.content !== "string"
    ){
        return res.status(400).send(contentErrorMessage);
    }
    if(
        !("level" in body) ||
        typeof body.level !== "string" ||
        !isValidLevel(body.level)
    ){
        return res.status(400).send(levelMissingErrorMessage);
    }
    
    const id = String(req.params.id);
    const {content, level} = body as NewText;
    let text = modText(id, content, level);

    if(text){
        return res.json(text);
    }

    text = addTextWithId(id, content, level);

    return res.json(text);
});

export default router;
