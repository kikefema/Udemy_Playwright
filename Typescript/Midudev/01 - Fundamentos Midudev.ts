// strings
const nombre: string = "Midudev";
const saludo: string = `Hola, ${nombre}! Bienvenido a TypeScript.`;  // Inferido de tipescript
console.log(saludo);

// numbers
const edad2: number = 30;
let color = "0z09f"

// boleanos
let isactive: boolean = true;
isactive = false;
console.log(`El estado activo es: ${isactive}`);

// null y undefined
let nulo: null = null;
let indefinido: undefined = undefined;

const numeroGrande: bigint = 9007199254741991n; //tiene que acabar con la n
const id: symbol = Symbol("id");
// diferencia en la inferencia de datos para adivinar el tipo de dato para let y con


// Arrays sintaxis 1
const numeros: number[] = [1, 2, 3, 4, 5];
numeros.push(6);

// arrays sintaxis 2
const numerosAlt: Array<number> = [10, 20, 30];
numerosAlt.push(40);

let empty = []; // ESTO HAY QUE EVITARLO
empty.push(1);


// Array con varios tipos de datos
const variosTipos: (number | string | boolean)[] = [1, "dos", true];
variosTipos.push(3);
variosTipos.push("cuatro");
variosTipos.push(false);



// tuplas
const tupla: [number, string] = [1, "uno"];
console.log(`Tupla: ${tupla[0]}, ${tupla[1]}`);
