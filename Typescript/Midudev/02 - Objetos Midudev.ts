////////////// MALA PRAXIS ////////////////////////

const user: {name: string; age: number; isAdmin: boolean} = {
    name: "Juan",
    age: 28,
    isAdmin: true
};

const otrouser = {
    name: "Ana",
    age: 22,
    isAdmin: false
};

 ////////////// BUENA PRAXIS ////////////////////////

type User = {
    name: string;
    age: number;
    isAdmin: boolean;
};
const terceruser: User = {
    name: "Luis",
    age: 35,
    isAdmin: true
};
