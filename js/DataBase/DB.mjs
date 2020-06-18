import {createTable} from './table.mjs';

export function createDB() {
    const tables = new Map();

    const setNewTable = function(name, attributes){//cria uma nava tabela e seus atributos
        //não tem tratamento de erro para os parâmetros
        tables.set(name, createTable(name, attributes));
        console.log("tabela: '" + name + "' criada com sucesso...");
    }
    const getTable = function(tableName) {//retorna uma tabela já existente

        if (!tables.has(tableName)) {//validação de 'tableName'
                console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        return tables.get(tableName);
    }
    const deleteTable = function(tableName) {//deleta uma tabela já existente

        if (!tables.has(tableName)) {//validação de 'tableName'
            console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        tables.delete(tableName);
    }
    const setNewRecord = function(tableName, attributeValues) {//cria um novo resgistro na tablea 'tableName' com os atributos contidos em 'attributeValues'
        //'attributeValues' deve receber um 'Map' com 'keys' iguais aos valores em 'tables.get(tableName).attributes'
        const table = tables.get(tableName);

        if (!tables.has(tableName)) {//validação de 'tableName'
            console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        for (let i = 0; i < table.attributes.length; i++) {//validação das keys contidos em 'attributeValues'
            if (!attributeValues.has(table.attributes[i])) {
                console.log("o parâmetro 'value' não contem 'keys' válidas!!!");
                return;
            }
        }
        //não valida os valores contidos em 'attributeValues'

        table.records.push(new Map());

        for (let i = 0; i < table.attributes.length; i++) {//criação de um novo resgistro
            table.records[table.records.length - 1].set(table.attributes[i], attributeValues.get(table.attributes[i]));
        }
        console.log("registro criado com sucesso...")
    }
    const setRecord = function(tableName, attributeValues, idx) {//muda o valor contiudo em um registro já existente

        const table = tables.get(tableName);

        if (!tables.has(tableName)) {//validação de 'tableName'
            console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        if (table.records[idx] === undefined){//validação do idx
            console.log("o registro em 'records[" + idx + "]' não existe!!!");
            return;
        }

        for (let i = 0; i < table.attributes.length; i++) {//validação das keys contidos em 'value'
            if (!attributeValues.has(table.attributes[i])) {
                console.log("o parâmetro 'value' não contem 'keys' válidas!!!");
                return;
            }
        }

        for (let i = 0; i < table.attributes.length; i++) {//criação de um novo resgistro
            table.records[idx].set(table.attributes[i], attributeValues.get(table.attributes[i]));
        }
        console.log("registro alterado com sucesso...")
    }
    const getRecord = function(tableName, idx) {//retorna um registro já existente

        const table = tables.get(tableName);

        if (!tables.has(tableName)) {//validação de 'tableName'
            console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        if (table.records[idx] === undefined){//validação do idx
            console.log("o registro em 'records[" + idx + "]' não existe!!!");
            return;
        }

        return table.records[idx];
    }
    const deleteRecord = function(tableName, idx) {//deleta um registro já existente

        const table = tables.get(tableName);

        if (!tables.has(tableName)) {//validação de 'tableName'
            console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        if (table.records[idx] === undefined){//validação do idx
            console.log("o registro em 'records[" + idx + "]' não existe!!!");
            return;
        }

        table.records.splice(idx, 1);

        console.log("registro apagado com sucesso...")
    }
    const findRecords = function(tableName, attribute, value) {//retorna uma array de registros que tenham o mesmo valor no atributo correspondente

        const table = tables.get(tableName);
        const results = new Array();

        if (!tables.has(tableName)) {//validação de 'tableName'
            console.log("a tabela: '" + tableName + "' não existe!!!")
            return;
        }

        if (!table.attributes.includes(attribute)) {//validação de 'atribute'
            console.log("a tabela: '" + tableName + "' não possue o atributo: '" + attribute + "' !!!");
            return;
        }

        for (let i = 0; i < table.records.length; i++) {

            const recordAttributeValue = table.records[i].get(attribute);

            if (recordAttributeValue === value) {
                results.push(tables.get(tableName).records[i]);
            }
        }

        return results;
    }

    console.log("banco de dados criado com sucesso...");

    return {
        tables,
        setNewTable,
        getTable,
        deleteTable,
        setNewRecord,
        setRecord,
        getRecord,
        deleteRecord,
        findRecords
    };
}