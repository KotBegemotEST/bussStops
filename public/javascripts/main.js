let regOpt = document.querySelector("#regions_list");
let showRegionsBtn = document.querySelector("#sendRegions");
let input = document.querySelector("#regions_input")
//---------------------------------------------------------------- AutoComplite ---------------------------------------------------------------
function createDataList() {


    let regOpt = document.querySelector("#regions_list")


    input.onfocus = function () {
        regOpt.style.display = 'block';
        input.style.borderRadius = "5px 5px 0 0";
    };




    input.oninput = function () {
        var text = input.value.toUpperCase();
        for (let option of regOpt.options) {
            if (option.value.toUpperCase().indexOf(text) > -1) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        };
    }

    var currentFocus = -1;
    input.onkeydown = function (e) {
        if (e.keyCode == 40) {
            currentFocus++
            addActive(regOpt.options);
        }
        else if (e.keyCode == 38) {
            currentFocus--
            addActive(regOpt.options);
        }
        else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (regOpt.options)
                    regOpt.options[currentFocus].click();
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
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}


const div = document.querySelector('#regionsFocus');

document.addEventListener('click', (e) => {
    const withinBoundaries = e.composedPath().includes(div);

    if (!withinBoundaries) {
        document.getElementById("regions_list").style.display = 'none'; // скрываем элемент т к клик был за его пределами
    }
})
//---------------------------------------------------------------- AutoComplite ---------------------------------------------------------------
showRegionsBtn.addEventListener("click", () => {
    let inputValue = input.value;
    console.log(inputValue)

    console.log("передал гет")


    // const options = {
    //     method: "POST",
    //     body: inputValue,
    //     headers: {
    //         "Content-Type": "application/json"
    //     }
    // }
    // console.warn(options)
    // // send post request
    // fetch("/sendRegion", options)
    //     .then(async response => {

    //         try {
    //             const data = await response.json()
    //             console.log('response data?', data)
    //         } catch (error) {
    //             console.log('Error happened here!')
    //             console.warn(error)
    //             // console.error(error)
    //         }
    //     })

    //     //     res => res.json())
    // .then(res => console.log(res))
    // .catch(err => console.warn(err));


    fetch('http://localhost:3000/getAllStops/'+inputValue)
    .then(res => console.log(res))
    .catch(err => console.warn(err));


})

//---------------------------------------------------------------- Function to show regions in dropdown ---------------------------------------------------------------



function main() {
    createDataList();
    getText('/getAllRegions', showRegions);



}


function showRegions(data) {
    if (document.querySelector("#regions_input")) {
        console.log(data)
        let parseResult = JSON.parse(data)
        for (k in parseResult) {
            let option = document.createElement("option");
            region = parseResult[k]["zone_name"]
            option.value = region
            option.innerHTML = region
            regOpt.appendChild(option)
        }
    }

    for (let option of regOpt.options) {
        option.onclick = () => {
            console.log(option)
            input.value = option.value;
            regOpt.style.display = 'none';
            input.style.borderRadius = "5px";
        }
    };
}

window.addEventListener('DOMContentLoaded', (event) => {
    main()
});


//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------
getText = async function (url, callback) {
    var request = new XMLHttpRequest();
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