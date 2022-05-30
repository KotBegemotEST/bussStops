//---------------------------------------------------------------- Function to show regions in dropdown ---------------------------------------------------------------


function main(){
    getText('/getAllRegions', showRegions);

}


function showRegions(data) {
    if (document.querySelector(".dropdown-menu")) {
        console.log(data)
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    main()
});


//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------
getText = async function (url, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            console.log(request.responseText)
            callback(request.responseText);
        }
    };
    console.log("передал гет")
    request.open("GET", url);
    request.send();
}
//---------------------------------------------------------------- Function for ajax get call ---------------------------------------------------------------
//---------------------------------------------------------------- Function to show regions in dropdown ---------------------------------------------------------------