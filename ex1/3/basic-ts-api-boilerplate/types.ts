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
  title: String;
  director: String;
  duration: number;
  budget?: number;
  description?: String;
  imageURL?: String;
}

type NewFilm = Omit<Film, "id">;

export type { Pizza, NewPizza, PizzaToUpdate, Film, NewFilm };
