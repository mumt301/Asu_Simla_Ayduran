
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

function getAlbData(xhttp) {
    let data = xhttp.responseXML; 
    console.log(data);

    let releaselist = data.getElementsByTagName("release-group-list")[0]; 
    console.log(releaselist);
    let releaseGroups = releaselist.getElementsByTagName("release-group");
    let releaseCount = releaseGroups.length;
    document.getElementById("albums").innerHTML = "There are " + releaseCount + " albums released."; 
    console.log(releaseCount);
    var AlbumNames = []; 
    var AlbumDates = [];

    for (let index = 0; index < releaseCount; index++) {
        let albumData = releaselist.getElementsByTagName("release-group")[index];
        let albumName = albumData.getElementsByTagName('title')[0].innerHTML; 
        console.log(albumName);
        AlbumNames[index] = albumName;
        let albumDate = albumData.getElementsByTagName('first-release-date')[0].innerHTML; 
        console.log(albumDate);
        AlbumDates[index] = albumDate;
    }
    console.log(AlbumNames); console.log(AlbumDates);
    text = "<tr><th>Album Name</th><th>Release Date</th></tr>";
    for (i = 0; i < AlbumNames.length; i++) {
        text += "<tr><td> " + AlbumNames[i] + "</td>";
        text += "<td> " + AlbumDates [i] + "</td></tr>";
    }
    let disco = document.getElementById('disco'); 
    disco.innerHTML = text;
}
window.onload = queryArtist;
