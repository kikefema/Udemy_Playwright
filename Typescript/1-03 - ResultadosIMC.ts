import { interpretarIMC } from "./1-02 - Metodos";

const persona = new IMC(70, 1.75);

const valorIMC = persona.calcularIMC();
const resultado = interpretarIMC(valorIMC);

console.log(valorIMC);   // 22.86
console.log(resultado);  // Peso normal

