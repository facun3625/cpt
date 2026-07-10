export type Tramo = { pct: string; base: string; monto: string };

export type Categoria = {
  nombre: string;
  tramos: Tramo[];
  totalBase: string;
  totalMonto: string;
  saldo: string;
};

export const arquitectura: Categoria[] = [
  {
    nombre: "1° Categoría",
    tramos: [
      { pct: "6,00 %", base: "58.869.768", monto: "3.532.186" },
      { pct: "5,50 %", base: "235.483.468", monto: "12.951.591" },
      { pct: "5,00 %", base: "294.354.439", monto: "14.717.722" },
      { pct: "4,50 %", base: "1.766.124.983", monto: "79.475.624" },
    ],
    totalBase: "2.354.832.658",
    totalMonto: "110.677.123",
    saldo: "4,00 % del saldo",
  },
  {
    nombre: "2° Categoría",
    tramos: [
      { pct: "7,00 %", base: "58.869.768", monto: "4.120.884" },
      { pct: "6,50 %", base: "235.483.468", monto: "15.306.425" },
      { pct: "6,00 %", base: "294.354.439", monto: "17.661.266" },
      { pct: "5,50 %", base: "1.766.124.983", monto: "97.136.874" },
    ],
    totalBase: "2.354.832.658",
    totalMonto: "134.225.450",
    saldo: "5,00 % del saldo",
  },
  {
    nombre: "3° Categoría",
    tramos: [
      { pct: "7,50 %", base: "58.869.768", monto: "4.415.233" },
      { pct: "7,00 %", base: "235.483.468", monto: "16.483.843" },
      { pct: "6,50 %", base: "294.354.439", monto: "19.133.039" },
      { pct: "6,00 %", base: "1.766.124.983", monto: "105.967.499" },
    ],
    totalBase: "2.354.832.658",
    totalMonto: "145.999.613",
    saldo: "5,50 % del saldo",
  },
  {
    nombre: "4° Categoría",
    tramos: [
      { pct: "15,00 %", base: "29.435.220", monto: "4.415.283" },
      { pct: "14,00 %", base: "29.435.220", monto: "4.120.931" },
      { pct: "12,00 %", base: "58.869.771", monto: "7.064.373" },
      { pct: "11,00 %", base: "235.483.423", monto: "25.903.177" },
    ],
    totalBase: "353.223.634",
    totalMonto: "41.503.763",
    saldo: "10,00 % del saldo",
  },
  {
    nombre: "5° Categoría",
    tramos: [
      { pct: "10,00 %", base: "29.435.220", monto: "2.943.522" },
      { pct: "9,50 %", base: "29.435.220", monto: "2.796.346" },
      { pct: "9,00 %", base: "58.869.771", monto: "5.298.279" },
      { pct: "8,50 %", base: "235.483.423", monto: "20.016.091" },
    ],
    totalBase: "353.223.634",
    totalMonto: "31.054.238",
    saldo: "8,00 % del saldo",
  },
];

export const ingenieria: Categoria[] = [
  {
    nombre: "1° Categoría",
    tramos: [
      { pct: "7,00 %", base: "23.548.183", monto: "1.648.373" },
      { pct: "6,00 %", base: "35.321.552", monto: "2.119.293" },
      { pct: "5,00 %", base: "117.739.479", monto: "5.886.974" },
      { pct: "4,00 %", base: "412.089.186", monto: "16.483.567" },
      { pct: "3,50 %", base: "1.766.093.834", monto: "61.813.284" },
    ],
    totalBase: "2.354.792.234",
    totalMonto: "87.951.492",
    saldo: "3,00 % del saldo",
  },
  {
    nombre: "2° Categoría",
    tramos: [
      { pct: "9,00 %", base: "23.548.183", monto: "2.119.336" },
      { pct: "7,00 %", base: "35.321.552", monto: "2.472.509" },
      { pct: "6,00 %", base: "117.739.479", monto: "7.064.369" },
      { pct: "5,00 %", base: "412.089.186", monto: "20.604.459" },
      { pct: "4,00 %", base: "1.766.093.834", monto: "70.643.753" },
    ],
    totalBase: "2.354.792.234",
    totalMonto: "102.904.427",
    saldo: "3,50 % del saldo",
  },
  {
    nombre: "3° Categoría",
    tramos: [
      { pct: "11,00 %", base: "23.548.183", monto: "2.590.300" },
      { pct: "9,00 %", base: "35.321.552", monto: "3.178.940" },
      { pct: "7,00 %", base: "117.739.479", monto: "8.241.764" },
      { pct: "6,00 %", base: "412.089.186", monto: "24.725.351" },
      { pct: "5,00 %", base: "1.766.093.834", monto: "88.304.692" },
    ],
    totalBase: "2.354.792.234",
    totalMonto: "127.041.046",
    saldo: "4,00 % del saldo",
  },
  {
    nombre: "4° Categoría",
    tramos: [
      { pct: "13,00 %", base: "23.548.183", monto: "3.061.264" },
      { pct: "11,00 %", base: "35.321.552", monto: "3.885.371" },
      { pct: "9,00 %", base: "117.739.479", monto: "10.596.553" },
      { pct: "7,00 %", base: "412.089.186", monto: "28.846.243" },
      { pct: "5,50 %", base: "1.766.093.834", monto: "97.135.161" },
    ],
    totalBase: "2.354.792.234",
    totalMonto: "143.524.592",
    saldo: "4,50 % del saldo",
  },
  {
    nombre: "5° Categoría",
    tramos: [
      { pct: "14,00 %", base: "23.548.183", monto: "3.296.746" },
      { pct: "12,00 %", base: "35.321.552", monto: "4.238.586" },
      { pct: "10,00 %", base: "117.739.479", monto: "11.773.948" },
      { pct: "8,00 %", base: "412.089.186", monto: "32.967.135" },
      { pct: "6,00 %", base: "1.766.093.834", monto: "105.965.630" },
    ],
    totalBase: "2.354.792.234",
    totalMonto: "158.242.045",
    saldo: "5,00 % del saldo",
  },
];

export const disposicionesGenerales: Categoria[] = [
  {
    nombre: "Art. 63° A",
    tramos: [
      { pct: "1,00 %", base: "23.548.183", monto: "235.482" },
      { pct: "0,75 %", base: "35.321.552", monto: "264.912" },
      { pct: "0,50 %", base: "117.739.479", monto: "588.697" },
      { pct: "0,25 %", base: "412.089.186", monto: "1.030.223" },
      { pct: "0,25 %", base: "1.766.093.834", monto: "4.415.235" },
    ],
    totalBase: "2.354.792.234",
    totalMonto: "6.534.548",
    saldo: "0,25 % del saldo",
  },
  {
    nombre: "Art. 16°",
    tramos: [
      { pct: "2,00 %", base: "159.362.996", monto: "3.187.260" },
      { pct: "1,80 %", base: "159.362.996", monto: "2.868.534" },
      { pct: "1,50 %", base: "318.725.941", monto: "4.780.889" },
      { pct: "1,25 %", base: "956.177.987", monto: "11.952.225" },
      { pct: "1,00 %", base: "1.593.629.268", monto: "15.936.293" },
    ],
    totalBase: "3.187.259.188",
    totalMonto: "38.725.200",
    saldo: "0,75 % del saldo",
  },
];
