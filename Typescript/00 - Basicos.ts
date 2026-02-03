// Introducción a TypeScript: Tipos de datos básicos y operaciones

// Variables numéricas. Aceptan tanto enteros como decimales.
let edad: number = 30;
let altura: number = 1.75;
let peso: number = 80;

// Variables texto
let texto1: string = "Hola mundo";
let texto2: string = 'Bienvenido';

// Variables booleanas
let encendido: boolean = true;
let apagado: boolean = false;

// Variables inferidas
let ciudad = "Madrid"; // TypeScript infiere que es de tipo string
let temperatura = 20; // TypeScript infiere que es de tipo number

// Definición de arrays
let numArray: number[] = [1, 2, 3, 4, 5];
let textArray: string[] = ["a", "b", "c", "d", "e"]

// Definicion de duplas
let dupla: [number, string] = [1, "uno"];

// Definición de enumerados y demo de condicional
enum Color {
    Rojo,
    Verde,
    Azul
}
let colorFavorito: Color = Color.Verde;

if (colorFavorito === Color.Verde) {
    console.log ("Tu color favorito es el verde");
}  else {
    console.log ("Tu color favorito no es el verde");
}


// Operaciones aritméticas
let suma: number = edad + edad;
let resta: number = peso - edad;
let multiplicacion: number = peso * edad;
let division: number = peso / edad;

// Condicionales
if (encendido) {
    console.log ("El sistema está encendido");
} else {
    console.log ("El sistema está apagado");
}


