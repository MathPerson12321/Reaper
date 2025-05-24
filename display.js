let data = null;
async function getData() {
    const response = await fetch('data.json');
    const thisdata = await response.json();
    data = thisdata;
}
async function loadData() {
    await getData();
    console.log(data);
}
loadData();

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
    if(seconds > 0){
        return seconds + " seconds";
    }
}

function calcTime(){
    return (data.starttime-unixtime)*1000;
}

function reaped(){
    
}

function getTimeFromUnix(){
    let time = calcTime();
    if(data.length > 0){
        const lastarr = data[data.length-1];
        const unixtime = Math.floor(Date.now()/1000);
        time = (unixtime*1000)-lastarr.timereap;
    }
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
    }
},1000);

