
function queryArtist () {
    let params = (new URL(document.location)).searchParams;
    if (params.has('artist')){
        let artistName = params.get('artist'); 
        console.log(artistName);
        let mbBaseURL = "https://musicbrainz.org/ws/2/";
        let mbResource = "artist?query=";
        let queryURL = mbBaseURL + mbResource + artistName; 
        console.log(queryURL);
        httpGet(queryURL, getMBID);
    }
}
function queryAlbums(artistMBID) {
    let mbBaseURL = "https://musicbrainz.org/ws/2/";
    let mbBrowse = "release-group?artist=";
    let mbType = "&limit=200";
    let queryURL = mbBaseURL + mbBrowse + artistMBID + mbType;
    httpGet(queryURL, getAlbData);
}

function httpGet(theURL, cbFunction) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theURL);
    xmlHttp.send();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cbFunction(this);
        }
    };
}
function getMBID(xhttp) {
    let retrievedData = xhttp.responseXML; 
    console.log(retrievedData);
    let artistData = retrievedData.getElementsByTagName("artist")[0]; 
    console.log(artistData);
    let artistName = artistData.getElementsByTagName('name')[0].innerHTML; 
    console.log(artistName);
    let artistMBID = artistData.id; 
    console.log(artistMBID);
    queryAlbums(artistMBID);
}
/*let  = xhttp.responseXML;
    let releases = retrievedData.getElementsByTagName('release-group');
    let album_table = "<table><tr><th>Album Name</th><th>Released in</th></tr>";
    for (i = 0; i < releases.length; i++){
    let call = releases[i];
    let names = call.getElementsByTagName("title")[0].innerHTML;
    let dates = call.getElementsByTagName("first-release-date")[0].innerHTML;
    album_table += `<tr><td>${names}</td><td>${dates}"</td></tr>`;
}
album_table += "</table>"; */
function getAlbData(xhttp) {
    let retrievedData = xhttp.responseXML; 
    console.log(retrievedData);
    let releases = retrievedData.getElementsByTagName("release-group")[0]; 
    console.log(releases);
    let groups = releases.getElementsByTagName("release-group");
    let count = groups.length;
    console.log(count);
    var names = []; 
    var dates = [];

    for (let i = 0; i < count; i++) {
        let data = releases.getElementsByTagName("release-group")[i];
        let name = data.getElementsByTagName('title')[0].innerHTML; 
        console.log(name);
        names[i] = name;
        let date = data.getElementsByTagName('first-release-date')[0].innerHTML; 
        console.log(date);
        dates[i] = date;
    }
    console.log(names); console.log(dates);
    album_table = "<tr><th>Released Album Name</th><th>Released in</th></tr>";
    for (index= 0; index < names.length; index++) {
        album_table += "<tr><td> " + names[index] + "</td>";
        album_table += "<td> " + dates[index] + "</td></tr>";
    }
    let disco= document.getElementById('disco'); 
    disco.innerHTML = album_table;
}
window.onload = queryArtist;
