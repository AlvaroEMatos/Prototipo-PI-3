const express = require('express');
const bodyParser = require('body-parser');
const minDB = require ('mindb');
const fs = require('fs-js');

///////////////////////////////////////////////// configuração do express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', express.static('static'));
//app.use(cookieParser());

//////////////////////////////////////////////// configuração do banco de dados
minDB.create("DBtest");
const DBtest = minDB.get("DBtest");

DBtest.collection("client");
DBtest.collection("company");
DBtest.collection("supplier");
DBtest.collection("deliveryman");
DBtest.collection("products");

recoverData(DBtest);


/////////////////////////////////////////////////// configuração das requisiçoes http
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/html/login.html');
});

app.post('/login', (req, res) => {
    const login = req.body;
    const collectionList = DBtest.list();

    for (let i = 0; i < collectionList.length - 1; i++) { // '-1' porque não precisa procurar 'username' em 'DBtest.products'
        let register = DBtest[collectionList[i]].get(login.username);

        //console.log(collectionList[i]);
        //console.log(DBtest[collectionList[i]].get(login.username));

        if (!(register === undefined) && login.password === register.password) {

            res.redirect('/' + collectionList[i] + '/home/' + login.username);

            console.log("login efetuado com sucesso...");
            break;
        }
    }
    console.log("login não foi efetuado...");

    res.sendFile(__dirname + '/html/login-erro.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/html/register.html');
});

app.get('/register/client', (req, res) => {
    res.sendFile(__dirname + '/html/client-register.html');
});

app.post('/register/client', (req, res) => {
    const register = req.body;
    //console.log(register);

    //senha exposta
    DBtest.client.insert({
        _id: register.username,
        name: register.name,
        password: register.password,
        email: register.email,
        fone: register.fone,
        street: register.street,
        neighborhood: register.neighborhood,
        city: register.city,
        number: register.number
    });

    res.redirect('http://localhost:8080/login');

    console.log("cadastro efetuado com sucesso...");
});

app.get('/register/company', (req, res) => {
    res.sendFile(__dirname + '/html/company-register.html');
});

app.post('/register/company', (req, res) => {
    const register = req.body;
    
    //não valida 'username'
    //senha exposta
    DBtest.company.insert({
        _id: register.username,
        name: register.name,
        password: register.password,
        email: register.email,
        fone: register.fone,
        street: register.street,
        neighborhood: register.neighborhood,
        city: register.city,
        number: register.number
    });

    res.redirect('http://localhost:8080/login');

    console.log("cadastro efetuado com sucesso...");
});

app.get('/register/supplier', (req, res) => {
    res.sendFile(__dirname + '/html/supplier-register.html');
});

app.post('/register/supplier', (req, res) => {
    const register = req.body;
    
    //senha exposta
    DBtest.supplier.insert({
        _id: register.username,
        name: register.name,
        password: register.password,
        email: register.email,
        fone: register.fone,
        street: register.street,
        neighborhood: register.neighborhood,
        city: register.city,
        number: register.number
    });

    res.redirect('http://localhost:8080/login');

    console.log("cadastro efetuado com sucesso...");
});

app.get('/register/deliveryman', (req, res) => {
    res.sendFile(__dirname + '/html/deliveryman-register.html');
});

app.post('/register/deliveryman', (req, res) => {
    const register = req.body;
    
    //senha exposta
    minDB.DBtest.deliveryman.insert({
        _id: register.username,
        name: register.name,
        password: register.password,
        email: register.email,
        fone: register.fone,
        street: register.street,
        neighborhood: register.neighborhood,
        city: register.city,
        number: register.number
    });

    res.redirect('http://localhost:8080/login');

    console.log("cadastro efetuado com sucesso...");
});

app.get('/client/home/:username', (req, res) => {
    const username = req.username;

    res.sendFile(__dirname + '/html/client-home.html'); 
});

app.get('/company/home/:username', (req, res) => {
    const username = req.username;

    res.sendFile(__dirname + '/html/company-home.html'); 
});

app.get('/deliveryman/home/:username', (req, res) => {
    const username = req.username;

    res.sendFile(__dirname + '/html/deliveryman-home.html'); 
});

app.get('/supplier/home/:username', (req, res) => {
    const username = req.username;

    res.sendFile(__dirname + '/html/supplier-home.html'); 
});

app.get('/client/results', (req, res) => {
    var search = req.query.search;
    var query = new Array();

    search = search.toLowerCase().replace(" ", "");

    query = query.concat(DBtest.products.find().where("name").eq(search).exec());
    query = query.concat(DBtest.products.find().where("brand").eq(search).exec());

    console.log("Busca realizada com sucesso...");
    
    res.json(query);
});

app.get('/company/results', (req, res) => {
    var search = req.query.search;
    var query = new Array();

    search = search.toLowerCase().replace(" ", "");

    //não implementado

    console.log("Busca realizada com sucesso...");
    
    res.json(query);
});

////////////////////////////////////////////////////////////////////////// configuração de eventos para quando o server é iniciado e encerrado
app.listen(8080, () => {
    console.log("server rodando em: http://localhost:8080");

    process.stdin.resume();//o programa não fecha instantâneamente
    
    process.on('exit', () =>{
        writeData(DBtest);//guarda as informações do miniDB na memória secundária

        console.log("servidor encerrado...");
    });
    
    //ctrl+c
    process.on('SIGINT', () =>{
        process.exit(2);
    });
    
    //"kill pid" (exemplo: nodemon restart) //não funciona
    process.on('SIGUSR1', () => {
        process.exit(3);
    });
    process.on('SIGUSR2', () => {
        process.exit(4);
    });
    
    //excessões não capturadas
    process.on('uncaughtException', (e) => {
        console.log('excessão não capturada...');
        console.log(e.stack);
        process.exit(99);
    });
});

////////////////////////////////////////////////////////////////////////////////////////// métodos para salvar os dados do DB no HD
function recoverData(db) {
    const collectionList = db.list();
    //console.log(collectionList);

    for (let i = 0; i < collectionList.length; i++) {
        let content;

        try {
            console.log('carregando DB do HD...');
            content = JSON.parse(fs.readFileSync('data/' + collectionList[i] + ".json"));

        } catch (err) {
            console.log("não foram encontrados arquivos no HD, iniciando coleção vazia...");
            continue;
        }
        //console.log(content);

        for (let j = 0; j < content.length; j++) {
            if (!(content === undefined)) {
                db.get(collectionList[i]).insert(content[j]);
            }
        }
    }
}

function writeData(db) {
    const collectionList = db.list();
    //console.log(collectionList);

    for (let i = 0; i < collectionList.length; i++) {
        let content = db.get(collectionList[i]).values();

        console.log('salvando DB no HD...');

        try {
        fs.writeFileSync('data/' + collectionList[i] + ".json", JSON.stringify(content))
        
        } catch (err) {
            console.log("não foi possível escrever no HD, DB perdido...");
            continue;
        }
    }
}

