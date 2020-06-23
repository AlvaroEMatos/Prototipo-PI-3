const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const minDB = require ('mindb');
const fs = require('fs-js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

minDB.create("DBtest");
const DBtest = minDB.get("DBtest");
DBtest.collection('users');
recoverData(DBtest);



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/testhtml/home.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/testhtml/login.html');
});

app.post('/login', (req, res) => {
    const login = req.body;
    const register = minDB.DBtest.users.get(login.username);

    if (!(register === undefined) && login.password === register.password) {

        res.redirect('http://localhost:8080/user-page/' + login.username + '/');

        console.log("login efetuado com sucesso...");

    }else {

        res.redirect('http://localhost:8080/login');

        console.log("login não foi efetuado...");
    }
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/testhtml/register.html');
});

app.post('/register', (req, res) => {
    const register = req.body;

    //não valida 'cpf'
    //não valida 'username'
    //senha exposta
    if (register.password1 === register.password2) {

        minDB.DBtest.users.insert({_id: register.username, cpf: register.cpf, password: register.password1});
        res.redirect('http://localhost:8080/login');

        console.log("cadastro efetuado com sucesso...");

    }else {

        res.redirect('http://localhost:8080/register');

        console.log("cadastro não foi efetuado...");
    }
});

app.get('/user-page/:username/', (req, res) => {
    const username = req.username;

    res.sendFile(__dirname + '/testhtml/user-page.html')
});

app.get('/results', (req, res) => {
    res.sendFile(__dirname + '/testhtml/results.html')
});



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
    
    //"kill pid" (exemplo: nodemon restart)
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

function recoverData(db) {
    const collectionList = db.list();

    for (let i = 0; i < collectionList.length; i++) {
        let content;

        try {
            console.log('carregando DB do HD...');
            content = JSON.parse(fs.readFileSync('data/' + collectionList[i] + ".txt"));

        } catch (err) {
            console.log(err);
            console.log("não foram encontrados arquivos no HD, iniciando coleção vazia...");
        }

        console.log(content);

        for (let j = 0; j < content.length; j++) {
            if (!(content === undefined)) {
                db.get(collectionList[i]).insert(content[j]);
            }
        }
    }
}

function writeData(db) {
    const collectionList = db.list();

    for (let i = 0; i < collectionList.length; i++) {
        let content = db.get(collectionList[i]).values();

        console.log('salvando DB no HD...');

        try {
        fs.writeFileSync('data/' + collectionList[i] + ".txt", JSON.stringify(content))
        
        } catch (err) {
            console.log(err);
            console.log("não foi possível escrever no HD, DB perdido...");
        }
    }
}

