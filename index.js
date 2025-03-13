//const Database = require("@replit/database")
const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const bodyParser = require('body-parser');
const xhr = new XMLHttpRequest();
const app = express();
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const selectSort = require('./selectSort');
const calcRating = require('./calcRating');
const calcLevel = require('./calcLevel')

//const db = new Database();


app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.locals.basedir = __dirname + "/views/";

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname,'views/main/index.html'));
});

app.get('/leaderboard', (req, res) => {
	res.sendFile(path.join(__dirname,'views/leaderboard/index.html'));
});

app.get('/account/:user', async(req, res) => {
	res.status(410).end("Account system is removed.");
});

app.get("/api/desktop/version",async (req,res)=>{
	res.sendFile(path.join(__dirname,"api","musiclist.json"))
})
app.get("/api/desktop/update/download",async (req,res)=>{
	res.sendFile(path.join(__dirname,"api","MusicList.fm.musiclist"))
})

app.get('/api/get/account/:user', async(req, res) => {
	res.status(410).end("Account system is removed.");
});

app.post('/api/post/account/register', async(req, res) => {
	res.status(410).end("Account system is removed.");
});

app.post('/api/post/account/login', async(req, res) => {
	res.status(410).end("Account system is removed.")
});

app.post('/api/post/account/newdata', async(req, res) => {
	res.status(410).end("Account system is removed.");
});

app.get('/api/get/leaderboard', async (req, res) => {
	res.status(503).end("Leaderboard system is unavailable.");
});

app.post('/api/post/leaderboard', async (req, res) => {
	res.status(503).end("Leaderboard system is unavailable.");
});

app.get('/api/get/login/discord',async (req,res)=>{
	res.status(410).end("Account system is removed.");
})


app.listen(3000, () => {
  console.log('server started');
});
