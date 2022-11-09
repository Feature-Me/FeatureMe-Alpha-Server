const Database = require("@replit/database")
const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const keyv = require('keyv');
const bodyParser = require('body-parser');
const xhr = new XMLHttpRequest();
const app = express();
//const leaderboarddb = new keyv('sqlite://db.sqlite',{table:"leaderboard"})
//const userdb = new keyv('sqlite://db.sqlite',{table:"user"})
const path = require('path');
const crypto = require('crypto');
const  cors = require('cors');
const selectSort = require('./selectSort');
const calcRating = require('./calcRating');
const calcLevel = require('./calcLevel')

const db = new Database();


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
	const data = await db.get(req.params.user);
	let resdata;
	if(req.params.user=="leaderboard") data = null;
	if(data){
		resdata = {
	        exist:true,
			name:data.username,
			id:data.id,
			level:data.level,
			exp:data.exp,
			rating:data.rating,
			favorite:data.favorite,
			ratingBest:data.ratingBest,
			ratingRecent:selectSort(data.ratingRecent).slice(-10),
			requiredexp:Math.round(calcLevel(data.exp)[1])
	    };
		res.render(path.join(__dirname,'views/account/index.ejs'),{
			data:resdata
		});
	}else{
		resdata = {
			exist:false,
			name:req.params.user
		}
		res.render(path.join(__dirname,'views/account/notfound.ejs'),{
			data:resdata
		});
	}
	
});

app.get("/api/desktop/version",async (req,res)=>{
	res.sendFile(path.join(__dirname,"api","musiclist.json"))
})
app.get("/api/desktop/update/download",async (req,res)=>{
	res.sendFile(path.join(__dirname,"api","MusicList.fm.musiclist"))
})

app.get('/api/get/account/:user', async(req, res) => {
	const data = await db.get(req.params.user);
	let resdata = {};
	if(req.params.user=="leaderboard") data = null;
	if(data){
		resdata = {
			exist:true,
			name:data.username,
			id:data.id,
			level:data.level,
			exp:data.exp,
			rating:data.rating,
			favorite:data.favorite,
			ratingBest:data.ratingBest,
			ratingRecent:selectSort(data.ratingRecent).slice(-10),
			requiredexp:Math.round(calcLevel(data.exp)[1])
		}
	}else{
		resdata = {
			exist:false,
		};
	}
	
	res.json(resdata)
});

app.post('/api/post/account/register', async(req, res) => {
	try {
		const request  = req.body;
		const data = await db.get(request.username);
		if(data)throw new Error("this user is already registered");
		const id = parseInt(Number(new Date()),16)+parseInt(Number(new Date()),10);
		const password = crypto.createHash('sha512').update(request.password).digest('hex');
		const newUser = {
			username:request.username,
			id:id,
			password:password,
			level:1,
			exp:0,
			rating:"00.00",
			ratingBest:[],
			ratingRecent:[],
			favorite:[]
		}
		db.set(request.username,newUser);
	} catch (error) {
		console.error(error)
		res.json({details:`Error:${error}`})
		return;
	}
	res.json({details:'registered successfully.'})
});

app.post('/api/post/account/login', async(req, res) => {
	try {
		const request = req.body;
		const data = await db.get(request.username);
		if(!data)throw new Error('user does not exist.');
		if(request.auto==="true"){
			if(Number(request.id)!=data.id) throw new Error("invalid user id.");	
		}else{
			const password = crypto.createHash('sha512').update(request.password).digest('hex');
			if(password!=data.password) throw new Error("wrong password.");
		}
		resdata = {
			exist:true,
			name:data.username,
			id:data.id,
			level:data.level,
			exp:data.exp,
			rating:data.rating,
			ratingBest:data.ratingBest,
			ratingRecent:data.ratingRecent,
			requiredexp:calcLevel(data.exp)[1]
		}
		res.json(resdata);
	} catch (error) {
		console.error(error)
		res.json({details:`Error:${error}`})
		return;
	}
});

app.post('/api/post/account/newdata', async(req, res) => {
	try {
		const request = req.body;
		const data = await db.get(request.username);
		if(!data)throw new Error('user does not exist.');
		if(request.id!=data.id) throw new Error("invalid user id.");	
		console.log(request.rating,data.ratingBest,data.ratingRecent)
		data.ratingBest = selectSort(data.ratingBest);
		if(data.ratingBest.length<30) {
			data.ratingBest.push(Number(request.rating));
		}else if(data.ratingBest[0]<Number(request.rating)){
			data.ratingBest.shift();
			data.ratingBest.push(Number(request.rating));
			data.ratingBest = selectSort(data.ratingBest);
		}
		if(data.ratingRecent.length<50) {
			data.ratingRecent.push(Number(request.rating));
		}else {
			data.ratingRecent.shift();
			data.ratingRecent.push();
		}
		data.rating = calcRating(data.ratingBest,data.ratingRecent)
		data.exp+=Number(request.exp);
		data.level = calcLevel(data.exp)[0];
		db.set(request.username,data)
		const resdata = {
			exist:true,
			name:data.username,
			id:data.id,
			level:data.level,
			exp:data.exp,
			rating:data.rating,
			ratingBest:data.ratingBest,
			ratingRecent:data.ratingRecent,
			requiredexp:calcLevel(data.exp)[1]
		}
		res.json(resdata);
	} catch (error) {
		console.error(error)
		res.json({details:"Error:"+error})
		return;
	}
});

app.get('/api/get/leaderboard', async (req, res) => {
	const data = (await db.get('leaderboard'))
	res.json(data);
});

app.post('/api/post/leaderboard', async (req, res) => {
	let data = (await db.get('leaderboard'))||[]
	console.log(req.body)
	data.unshift(req.body);
	db.set('leaderboard',data);
});

app.get('/api/get/login/discord',async (req,res)=>{
	const cipher = crypto.createCipher('aes-256-ofb', "FeatureMe");
    const cipheredText = cipher.update(process.env.discordClientID+"\n"+process.env.discordClientToken, 'utf8', 'hex');
	res.send(cipheredText)
})


app.listen(3000, () => {
  console.log('server started');
});
