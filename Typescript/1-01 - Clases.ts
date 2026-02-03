// Definición de una clase IMC. Esto solo calcula el IMC
class IMC {
    // Propiedades de la clase
    peso: number; // en kilogramos
    altura: number; // en metros
    
    // Constructor para inicializar las propiedades
    constructor(peso: number, altura: number) {
        this.peso = peso;
        this.altura = altura;
    }

    // Método para calcular el Índice de Masa Corporal
    calcularIMC(): number {
        return this.peso / (this.altura * this.altura);
    } 
}
