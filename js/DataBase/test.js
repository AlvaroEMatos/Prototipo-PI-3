import {createDB} from './DB.mjs';

//*
const DB = createDB();
DB.setNewTable("clientTable", ["cpf", "firstName", "lastName", "address", "email", "nickname", "password"]);

const record1 = new Map()
record1.set("cpf", "47321000826");
record1.set("firstName", "Álvaro");
record1.set("lastName", "Esteves Matos");
record1.set("address", "***");
record1.set("email", "alvaro1000@live.com");
record1.set("nickname", "Han");
record1.set("password", "123");

const record2 = new Map()
record2.set("cpf", "555555555");
record2.set("firstName", "José");
record2.set("lastName", "Andrade");
record2.set("address", "***");
record2.set("email", "andrade200@gmail.com");
record2.set("nickname", "sésé");
record2.set("password", "4545");

const record3 = new Map()
record3.set("cpf", "57727955");
record3.set("firstName", "José");
record3.set("lastName", "Soares");
record3.set("address", "***");
record3.set("email", "joselito@gmail.com");
record3.set("nickname", "joselito");
record3.set("password", "4674");

DB.setNewRecord("clientTable", record1);
DB.setNewRecord("clientTable", record2);
DB.setNewRecord("clientTable", record3);

var results = DB.findRecords("clientTable", "firstName", "José");

console.log(DB.getTable("clientTable"));
console.log(results);
//*/
