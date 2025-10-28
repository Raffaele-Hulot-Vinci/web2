import { parse, serialize } from "../utils/json";
import { Text, levels, Levels } from "../types";
import { v4 as uuidv4 } from "uuid";

import path from "node:path";

const jsonDbPath = path.join(__dirname, "../data/texts.json");

const texts: Text[] = [
    {
        id: "7272e1a4-d07b-4fac-9586-7b0da2399c50",
        content: "test",
        level: "easy",
    },
    {
        id: "c83cbbbe-cc21-4402-8fbf-1b5067210e4a",
        content: "testing longer stuff",
        level: "medium",
    },
    {
        id: "4700fd03-3653-462d-985d-06f4401b9234",
        content: "testing the longest stuff to have something hard",
        level: "hard",
    },
];

function readAll(level: String | undefined = undefined): Text[] {
    let ttexts = parse(jsonDbPath, texts);

    if (level) {
        ttexts = ttexts.filter((text) => {
            return text.level === level;
        });
    }

    return ttexts;
}

function findById(id: String): Text | undefined {
    const ttexts = parse(jsonDbPath, texts);

    for (let i = 0; i < ttexts.length; i++) {
        if (ttexts[i].id === id) {
            return ttexts[i];
        }
    }
    return undefined;
}

function addText(content: String, level: Levels): Text{
    let id;
    do{
        id = uuidv4();
    }while(findById(id));

    return addTextWithId(uuidv4(), content, level);
}

function addTextWithId(id: String, content: String, level: Levels): Text {
    const text: Text = {
        id: id,
        content: content,
        level: level,
    };

    const ttexts = parse(jsonDbPath, texts);
    ttexts.push(text);
    serialize(jsonDbPath, ttexts);

    return text;
}

function modText(id: String, content: String, level: Levels): Text | undefined {
    const ttexts = parse(jsonDbPath, texts);
    const text = ttexts.find((text) => text.id === id);

    if(!text){
        return undefined;
    }

    if(content){
        text.content = content;
    }
    if(level){
        text.level = level;
    }

    serialize(jsonDbPath, ttexts);

    return text;
}

function removeText(id: String): Text | undefined {
    const ttexts = parse(jsonDbPath, texts);

    let text = undefined;
    for (let i = 0; i < ttexts.length; i++) {
        if (ttexts[i].id === id) {
            text = ttexts[i];
            ttexts.splice(i, 1);
            serialize(jsonDbPath, ttexts);
            return text;
        }
    }

    return undefined;
}

function isValidLevel(level: String): level is Levels {
    return levels.indexOf(level as Levels) != -1;
}

function levelsAsString(): String {
    let list: String = "";
    for (let i = 0; i < levels.length; i++) {
        list += "-" + levels[i] + "\n";
    }
    return list;
}

export { readAll, findById, addText, addTextWithId, isValidLevel, levelsAsString, removeText, modText };
