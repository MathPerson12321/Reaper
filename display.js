import {readData,writeData,recieveData,ref,db} from "./firebase.js";

let data = null;
let userlastreaps = null; //Last reap time for a user
let reaps = null;

document.addEventListener('DOMContentLoaded', async function() {
    loadUser();
    const gameinfo = await readData("data");
    data = gameinfo.val(); 
    console.log(data);

    const lastreaps = await readData("lastuserreap");
    userlastreaps = lastreaps.val();
    console.log(userlastreaps);

    const allreaps = await readData("reaps");
    reaps = allreaps.val();
    console.log(reaps);

    // Listen for changes to all reaps
    recieveData("reaps", updatedata);
});

function updatedata(data){
    reaps = data.val();
    console.log("Someone reaped.");

    mostrecentreapdisplay();
}


let userId = null;

function setUser(){
    userId = crypto.randomUUID();
    localStorage.setItem('userId', userId);
}

function loadUser(){
    userId = localStorage.getItem('userId');
    console.log(userId);
    if(!userId){
        setUser();
    }
}

function timetoseconds(milliseconds){
    let seconds = Math.floor(milliseconds/1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60)
    let days = Math.floor(hours/24);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    if(days > 0){
        return days + " days, " + hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
    }
    if(hours > 0){
        return hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
    }
    if(minutes > 0){
        return minutes + " minutes, " + seconds + " seconds";
    }
    else{
        return seconds + " seconds";
    }
}

function getMaxFromReaps(reapnumbers){
    let maxnum = -Infinity;
    for (let num of reapnumbers) {
        if (num > maxnum) {
            maxnum = num;
        }
    }
    return maxnum;
}

document.getElementById('reapbutton').addEventListener('click', reaped);
function reaped(){
    let timereaped = Date.now();
    writeData("lastuserreap/" + String(userId),timereaped);
    userlastreaps[String(userId)] = timereaped;

    const reapentry = {
        user: userId,
        timestamp: timereaped,
        timegain: getTimeFromUnix(timereaped)/1000,
        bonus: 1,
    };

    //Number the reaps
    const allkeys = Object.keys(reaps);
    const reapnumbers = allkeys.map(key=>parseInt(key));
    let nextnum = null;
    if (reapnumbers.length > 0) {
        nextnum = getMaxFromReaps(reapnumbers)+1;
    } else {
        nextnum = 1;
    }
    writeData("reaps/" + String(nextnum), reapentry);
    reaps[nextnum] = reapentry;

    console.log(timereaped);
    console.log(getTimeFromUnix(timereaped)); //Time reaped
    console.log(reaps);
}

function getTimeFromUnix(ms){ //Get the reaped time
    let time = ms-(data.starttime*1000);
    if(Object.keys(reaps).length>0){
        const keys = Object.keys(reaps);
        const keynumbers = keys.map(k=>parseInt(k));
        const max = getMaxFromReaps(keynumbers);
        const lastreap = reaps[max];
        time = ms-lastreap.timestamp;
    }
    return time; //Milliseconds
}

function mostrecentreapdisplay(){
    const arr = Object.entries(reaps);
    let count = 1;
    for(let i=arr.length-1;i>arr.length-11 && i>=0;i--){
        const [num,details] = arr[i];

        const date = new Date(details.timestamp);
        const options = {month:"short",day:"2-digit"};
        const datePart = date.toLocaleDateString("en-US", options);
        const timePart = date.toTimeString().split(' ')[0]
        const formatted = datePart + ", " + timePart;

        let str = details.user + " reaped at " + formatted + " and gained " + timetoseconds(details.timegain*1000);
        document.getElementById(count).innerHTML = str;
        count++;
    }
}

function displayTime(ms){
    document.getElementById("timer").innerHTML = timetoseconds(getTimeFromUnix(ms));
}

function displayCooldown(ms){
    let cooldownleft = (data.cooldown*1000+userlastreaps[String(userId)])-Date.now();
    document.getElementById("cd").innerHTML = "Cooldown: " + timetoseconds(cooldownleft) + " left";
}

setInterval(function(){
    const unixtime = Math.floor(Date.now()/1000);
    if (data.starttime > unixtime) {
        const res = timetoseconds(calcTime());
        document.getElementById("timeleft").innerHTML = res;
    }else{
        data.gamerunning = true;
        document.getElementById("wait").style.display = "none";
        document.getElementById("game").style.display = "block";
        displayTime(Date.now());
        if(Date.now()-userlastreaps[String(userId)] < data.cooldown*1000){
            document.getElementById("reapstuff").style.display = "none";
            document.getElementById("cooldown").style.display = "block";
            displayCooldown(Date.now());
        }else{
            document.getElementById("reapstuff").style.display = "block";
            document.getElementById("cooldown").style.display = "none";
        }
    }
},1000);

