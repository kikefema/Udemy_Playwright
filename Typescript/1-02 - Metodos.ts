
// Método para interpretar el resultado del IMC
//    interpretarIMC(): string {
//        const imc = this.calcularIMC();
//        if (imc < 18.5) {
//            return "Bajo peso";
//        } else if (imc >= 18.5 && imc < 24.9) {
//            return "Peso normal";
//        } else if (imc >= 25 && imc < 29.9) {
//            return "Sobrepeso";
//        } else {
//           return "Obesidad";
//        }
//    }

// Función externa para interpretar el IMC
export function interpretarIMC(imc: number): string {
    if (imc < 18.5) return "Bajo peso";
    if (imc < 24.9) return "Peso normal";
    if (imc < 29.9) return "Sobrepeso";
    return "Obesidad";
}

