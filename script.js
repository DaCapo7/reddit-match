var addsub, increase, decrease, startbut, remsub, digitinfo,nthtoshow,charge,green;
var sublist, digit;
var level;
var personJSONStringbobject;
var token = Math.random() * 10000000

var getlistofsub = function(){
    let temp = sublist.querySelectorAll("input");
    let result = [];
    temp.forEach((subreddit)=>{
        console.log(subreddit.value);
        if (subreddit.value != null){result.push(subreddit.value)}
    })
    return result;

}
var addsubonlist = function(){
    let temp = sublist.querySelectorAll("input")[0];
    let tempbis = sublist.insertBefore(document.createElement("input"), temp);
    tempbis.type = "text";
    tempbis.focus();

    sublist.insertBefore(document.createElement("br"), temp);
    console.log(temp)
}
var remsubonlist = function(){
    if(sublist.querySelectorAll("input").length > 1){
    let temp = sublist.querySelectorAll("input")[0];
    let temp2 = sublist.querySelectorAll("br")[0];
    sublist.removeChild(temp);
    sublist.removeChild(temp2);}
}
var updatedigit = function(){
    digitinfo.innerHTML = digit.value;
}
var starttheexp = function(){
    green.style.width = `0%`
    nthtoshow.innerHTML= "Wait up to 30 seconds";
    startbut.disabled = true;
    //charge.innerHTML = 0;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/', true);
    //Envoie les informations du header adaptées avec la requête
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() { //Appelle une fonction au changement d'état.
        clearInterval(getprogress)
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            startbut.disabled = false;
            let list = JSON.parse(xhr.responseText)
            if (typeof list == "string"){nthtoshow.innerHTML = list;nthtoshow.style = "color:black";return}
            if (list.length<1){nthtoshow.innerHTML = "No one seems to match on these subreddit, try again with a higher level, or wait a few times so that peoples share new posts";nthtoshow.style = "color:black";return}
            
            let listtoshow = ""
            list.forEach((elem)=>{
                if (elem != "An error occured, please try again (perhaps later)"){listtoshow += `<a href="https://www.reddit.com/u/${elem}">${elem}</a>`}
                else{listtoshow += elem}
                listtoshow += "<hr>"
            });
            nthtoshow.innerHTML = listtoshow
            nthtoshow.style = "color:black"
        }else{
            startbut.disabled = false;
        }
    }
    
    bobject = {"sublist": getlistofsub(), "level": digitinfo.innerHTML, "token": token};
    var personJSONString = JSON.stringify(bobject); 

    xhr.send(personJSONString);

    var getprogress = setInterval(getpercentprogress, 50);

    // xhr.send(new Int8Array());
    // xhr.send(document);

    /*let sublistlist = sublist.querySelectorAll("input");
    let subredditlist = [];
    sublistlist.forEach((subreddit)=>{
        console.log(subreddit.value);
        if (subreddit.value != null){subredditlist.push(subreddit.value)}
    })*/
}
var getpercentprogress = function(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/percent/${token}`, true);
    xhr.onload = function (e) {
    if (xhr.readyState === 4) {
        if (xhr.status != undefined) {
            if (parseFloat(xhr.responseText) <=100) {
                //charge.innerHTML = xhr.responseText;
                green.style.width = `${parseFloat(xhr.responseText)}%`
            }
            else{
                //charge.innerHTML = 100
                green.style.width = `100%`
            }
        
        }
    }
    };
    xhr.send(null);
}



window.addEventListener('load', function() {
    addsub = document.getElementById("addsub");
    digitinfo = document.getElementById("digitinfo");
    startbut = document.getElementById("startbut");
    sublist = document.getElementById("sublist");
    digit = document.getElementById("digit");
    remsub = document.getElementById("remsub");
    nthtoshow = this.document.getElementById("nthtoshow");
    charge = document.getElementById("charge");
    green = this.document.getElementById("green");

    level = digit.textContent;

    addsub.onclick = addsubonlist;
    remsub.onclick = remsubonlist;

    digit.oninput = updatedigit;
    startbut.onclick = starttheexp;
})

