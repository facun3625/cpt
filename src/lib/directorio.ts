export type Directivo = {
  nombre: string;
  cargo: string;
  photo?: string;
};

export const directorio: Directivo[] = [
  { nombre: "M.M.O. Sergio Ismael Romero", cargo: "Presidente" },
  { nombre: "M.M.O. Sergio Maximiliano Romero", cargo: "Vicepresidente" },
  { nombre: "M.M.O. Osvaldo Daniel Migliorelli", cargo: "Secretario" },
  { nombre: "M.M.O. Jorge Alberto Zavala", cargo: "Tesorero" },
  { nombre: "T.M.Elect. Gustavo Grenon", cargo: "Secretario de Actas" },
  { nombre: "T.C.N. Oscar Ramón Baldo", cargo: "Vocal Titular" },
  { nombre: "M.M.O. Leonardo Daniel Bruno", cargo: "Vocal Titular" },
  { nombre: "Téc. Ana María Acevedo", cargo: "Vocal Titular" },
];

export const tribunalEtica: Directivo[] = [
  { nombre: "M.M.O. Carlos David Isas", cargo: "Miembro Titular" },
  { nombre: "M.M.O. Héctor D. Domínguez", cargo: "Miembro Titular" },
  { nombre: "M.M.O. José Santiago Balboa", cargo: "Miembro Titular" },
];
