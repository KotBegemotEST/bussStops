let regOpt = document.querySelector("#regions_list");
let stopOpt = document.querySelector("#stops_list");
let sendRegion = document.querySelector("#sendRegions");
let showStops = document.querySelector("#showStops");
let region_input = document.querySelector("#regions_input")
let stops_input = document.querySelector("#stops_input")
//---------------------------------------------------------------- AutoComplite ---------------------------------------------------------------
function createDataList(inp,opt) {
    inp.onfocus = function () {
        opt.style.display = 'block';
        inp.style.borderRadius = "5px 5px 0 0";
    };

    inp.oninput = function () {
        let text = inp.value.toUpperCase();
        for (let option of opt.options) {
            if (option.value.toUpperCase().indexOf(text) > -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        };
    }

    let currentFocus = -1;
    inp.onkeydown = function (e) {
        if (e.keyCode == 40) {
            currentFocus++
            addActive(opt.options);
        }
        else if (e.keyCode == 38) {
            currentFocus--
            addActive(opt.options);
        }
        else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (opt.options)
                opt.options[currentFocus].click();
            }
        }
    }
}

function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0)
        currentFocus = (x.length - 1);
    x[currentFocus].classList.add("active");
}
function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}


const div = document.querySelector('#regionsFocus');

document.addEventListener('click', (e) => {
    const withinBoundaries = e.composedPath().includes(div);

    if (!withinBoundaries) {
        document.getElementById("regions_list").style.display = 'none'; 
    }
})
//---------------------------------------------------------------- AutoComplite ---------------------------------------------------------------
sendRegion.addEventListener("click", () => {
    let stopAreaValue = region_input.value;
    fetch('/getAllStops/'+stopAreaValue)
    .then(response => response.json())
    .then(data => loadStops(data));


})



//---------------------------------------------------------------- Function to show regions in dropdown ---------------------------------------------------------------



function main() {
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            setInterval(function(){setLoc(userLat, userLon)},10000);

        }, function(error) {
            console.log('Geolocation not defined')
        });
    } else {
        console.log("Can't find geolocation");
    }





    createDataList(region_input,regOpt);
    createDataList(stops_input,stopOpt);
    getText('/getAllRegions', showRegions);

}


function showRegions(data) {
    if (document.querySelector("#regions_input")) {
        let parseResult = JSON.parse(data)
        for (k in parseResult) {
            let option = document.createElement("option");
            region = parseResult[k]["stop_area"]
            option.value = region
            option.innerHTML = region
            regOpt.appendChild(option)
        }
    }
    for (let option of regOpt.options) {
        option.onclick = () => {
            region_input.value = option.value;
            regOpt.style.display = 'none';
            region_input.style.borderRadius = "5px";
        }
    };
}


function loadStops(data){
    if (document.querySelector("#stops_input")) {
        let parseResult = data
        for (k in parseResult) {
            let option = document.createElement("option");
            stops = parseResult[k]["stop_name"]
            option.value = stops
            option.innerHTML = stops
            stopOpt.appendChild(option)
        }
    }
    for (let option of stopOpt.options) {
        option.onclick = () => {
            stops_input.value = option.value;
            stopOpt.style.display = 'none';
            stops_input.style.borderRadius = "5px";
        }
    };
};



// let regOpt = document.querySelector("#regions_list");
// let stopOpt = document.querySelector("#stops_list");
// let sendRegion = document.querySelector("#sendRegions");
// let showStops = document.querySelector("#showStops");
// let region_input = document.querySelector("#regions_input")
// let stops_input = document.querySelector("#stops_input")

function loadBtns(data){
    console.log(data)
    const busesCont = document.querySelector('.buses');
    const stop_area = region_input.value;
    const stop_name = stops_input.value;
    let datetime = new Date();
    let datetimSplitted = datetime.toLocaleString().split(",");
    const dep_time = datetimSplitted[1].trim();
    
    console.log(dep_time);
    
    document.querySelector(".buses").innerHTML = '';

    let btns = "<div class='del'>";

    data.forEach(function({route_short_name}) {
        const btnClass = '.r'+ route_short_name;
        btns += `<button class="bus r-${route_short_name}">${route_short_name}</buttons>`;
    });

    btns += "</div>";
    busesCont.innerHTML += btns; 

    data.forEach(function({route_short_name}) {
        const btnClass = '.r-'+ route_short_name;
        
        document.querySelector(btnClass).addEventListener('click',function(){
            
            fetch('/getStopTimes/'+stop_area+'/'+stop_name+'/'+route_short_name+'/'+dep_time)
            .then(response => response.json())
            .then(data => loadTimes(data));
        });
        
    });
};

//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------
getText = async function (url, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };
    console.log("передал гет")
    request.open("GET", url);
    request.send();
}
//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------
//---------------------------------------------------------------- Function to show regions in dropdown ---------------------------------------------------------------


document.querySelector('#showStops').addEventListener('click', function(){
    const stop_area = region_input.value;
    const stop_name = stops_input.value;
    fetch('/getBuses/'+stop_area+'/'+stop_name)
    .then(response => response.json())
    .then(data => loadBtns(data));
});


function setLoc(lat,lon){
    let datetime = new Date();
    document.querySelector(".loc").innerHTML = '<b>User location: </b><br> Lat: '+ lat + '<br> Lon: ' + lon;
    document.querySelector(".time").innerHTML = '<b>Time: </b>' + datetime.toLocaleString();

    fetch('/getReg/'+lat+'/'+lon)
    .then(response => response.json())
    .then(data => setReg(data));

    fetch('/getNearestStops/'+lat+'/'+lon)
    .then(response => response.json())
    .then(data => setStops(data));
};

function setReg(data){
    console.log(data)
    data.forEach(function({stop_area}){
        document.querySelector(".user-reg").innerHTML = `Region: ${stop_area}`;
    });
}

function setStops(data){
    let pText = 'Nearest stops: '
    data.forEach(function({stop_name}){
        pText += `${stop_name}, `;
    });

    document.querySelector(".closes-stops").innerHTML = pText;
}

function loadTimes(data){
    console.log(data);
    const table = document.querySelector('table tbody');

    let tableHtml = "";

    if(data.length === 0){
        table.innerHTML = '<tr><td colspan="5" class="no-data" style="text-align: center;">No data</td></tr>'; 
    }
    else {
        let id = 1;
        data.forEach(function({route_short_name, departure_time, stop_name, trip_long_name}){
            tableHtml += '<tr>';
            tableHtml += '<td>'+id+'</td>';
            tableHtml += `<td>${route_short_name}</td>`;
            tableHtml += `<td>${departure_time}</td>`;
            tableHtml += `<td>${stop_name}</td>`;
            tableHtml += `<td>${trip_long_name}</td>`;
            tableHtml += '<tr>';
            id += 1;
        });
        table.innerHTML = tableHtml;
    }
};
window.addEventListener('DOMContentLoaded', (event) => {
    main()
});
