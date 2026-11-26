import api from "./api";

export const checkWord = (word: string) =>
  api.get(`/api/validate?word=${word}`).then((response) => response.data);
