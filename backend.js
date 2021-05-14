var express = require("express");
var app = express();
("use strict");
const snoowrap = require("snoowrap");
const r = new snoowrap({
    userAgent: "whatever",
    clientId: "useyouts",
    clientSecret: "yoursagain",
    username: "continue",
    password: "never-gonna-give-you-up",
});
let promises = []
let tokenandprogress = {}

function getarrayofuser(subreddit, level,token){
    return new Promise((accept,reject)=>{
        let arrayofuser = [];
        let arrayofpromises = [];
        let temp = r.getHot(subreddit, {limit: 100*level});
        temp.then((result) => {

        result = result.reverse();
        for (i = 0; i < result.length; i++) {
        let element = result[i];
        if (!arrayofuser.includes(element.author.name)) {
            arrayofuser.push(element.author.name);
        }
        temp2 = r.getSubmission(element.name).expandReplies({ limit: 1, depth: 1 });
        arrayofpromises.push(temp2);
        }

        //token start
        arrayofpromises.forEach((prom)=>{
            prom.then(()=>{tokenandprogress.token = [tokenandprogress.token[0]+1, tokenandprogress.token[1]];
            //console.log(tokenandprogress.token)
        })
        }) 



        Promise.all(arrayofpromises).then((values) => {
            values.forEach((replies)=>{
                replies.comments.forEach((element2) => {
                    if (!arrayofuser.includes(element2.author.name)) {
                        arrayofuser.push(element2.author.name);
                    }
                    });
            })
        console.log(arrayofuser.length);

        return accept(arrayofuser)
        });
        });
    })
}


//ex: getarrayofuser("announcements", 3);
Array.prototype.diff = function(arr2) {
    var ret = [];
    for(var i in this) {   
        if(arr2.indexOf(this[i]) > -1){
            ret.push(this[i]);
        }
    }
    return ret;
};

function getresults(subtofind, level, token){
    tokenandprogress.token = [0,subtofind.length*level*100]
    console.log(tokenandprogress.token)

return new Promise((resolve,reject)=>{
    thebestlist = [];
    let firstlistofusersarray  = [];
    subtofind.forEach((sub)=>{
        if (sub != ""){thebestlist.push(getarrayofuser(sub,level,token))}
    })
    if (thebestlist.length <= 0){
        resolve(["An error occured, please try again (perhaps later)"])
    }

    Promise.all(thebestlist).then((values) => {
        
        values.forEach((value)=>{firstlistofusersarray.push(value)})
        finallist = firstlistofusersarray[0]
        firstlistofusersarray.shift()
        firstlistofusersarray.forEach((listu)=>{
            finallist = finallist.diff(listu)
            console.log("final: "+finallist.length)
        })
        
        return resolve(finallist)
    })


})
    
}

//console.log(thebestlist[0])


//var bodyParser = require("body-parser")

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/" + "index.html");
});
app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + "/" + "style.css");
});
app.get('/script.js', function(req, res) {
    res.sendFile(__dirname + "/" + "script.js");
});


app.post('/', (request, response)=>{
    let myJson = request.body    //JSON.parse(request.body);      // your JSON
    console.log(myJson);
    let a = getresults(myJson.sublist, parseInt(myJson.level), parseFloat(myJson.level))
    let b = new Promise((resolve,r)=>{setTimeout(() => {console.log(";(");resolve('Exeeded limit timeout');}, 30000);})

    b.then((rep)=>{response.send(JSON.stringify(rep))})

    a.then((rep)=>{response.send(JSON.stringify(rep))})
});

app.get('/percent/:demandedtoken', function(req, res) {
    token = req.params.demandedtoken
    if (tokenandprogress.token != undefined){
        res.send(JSON.stringify(tokenandprogress.token[0]/tokenandprogress.token[1]*100))
    }else{
        res.send("0")
    }
});


let PORT = 3000;
app.listen(PORT)

//post method

