export function createTable(name, attributes) {

    const records = new Array();//lista de registros
   
    return { 
        name,
        attributes,
        records
    };
}