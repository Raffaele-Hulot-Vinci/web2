interface Pizza {
    id: number;
    title: string;
    content: string;
}

interface PizzaToUpdate {
    title?: string;
    content?: string;
}

type NewPizza = Omit<Pizza, "id">;

interface Film {
    id: number;
    title: string;
    director: string;
    duration: number;
    budget?: number;
    description?: string;
    imageURL?: string;
}

type NewFilm = Omit<Film, "id">;

export const levels = ["easy", "medium", "hard"] as const;
type Levels = typeof levels[number];

interface Text {
    id: String,
    content: String
    level: Levels
}

type NewText = Omit<Text, "id">;

export type { Pizza, NewPizza, PizzaToUpdate, Film, NewFilm, Text, NewText, Levels };
