let app = {
    priorMovieRow: -1,
    priorShowRow: -1,
    currentTab: '',
    loadedTabs: {}
}

function init() {
    window.movieIDs = {}; // Maps Movie ID to position in list
    for (var i = 0; i < movieList.length; i++) {
        movieIDs[movieList[i].id] = i;
    }
    document.querySelector("#movieCount").innerHTML = movieList.length
    document.querySelector("#tvCount").innerHTML = tvList.length
    document.querySelector("#recentCount").innerHTML = recentList.length
    document.querySelector("#historyCount").innerHTML = movieHistory.length
    setTab('M') // Start showing movie list
}
function setTab(code) { // M/T/R/H
    document.querySelector("#locMovies").style.display = (code == 'M' ? "" : "none");
    document.querySelector("#locTV").style.display = (code == 'T' ? "" : "none");
    document.querySelector("#locRecent").style.display = (code == 'R' ? "" : "none");
    document.querySelector("#locHistory").style.display = (code == 'H' ? "" : "none");

    document.querySelector("#tabMovies").className = (code != 'M' ? "tab" : "tab current");
    document.querySelector("#tabTV").className = (code != 'T' ? "tab" : "tab current");
    document.querySelector("#tabRecent").className = (code != 'R' ? "tab" : "tab current");
    document.querySelector("#tabHistory").className = (code != 'H' ? "tab" : "tab current");

    if (app.loadedTabs[code] == undefined) {
        if (code == 'M') { showMovies(); }
        if (code == 'T') { showTV(); }
        if (code == 'R') { showRecent(); }
        if (code == 'H') { showHistory(); }
        app.loadedTabs[code] = true;
    }

    app.currentTab = code;
}

function showTV() {
    var spn = document.createElement("span");
    var container = document.querySelector("#tvList");
    for (var i = 0; i < tvList.length; i++) {
        var show = tvList[i];
        var div = document.createElement("div");
        div.className = 'movie';
        div.dataset['key'] = show.id;
        div.innerHTML = show.title
        div.onclick=showTVDetail
        spn.append(div)
        var div2 = document.createElement("div");
        div2.className = "episodesContainer";
        div2.style.display = "none";
        for (var j = 0; j < show.seasons.length; j++) {
            var season = show.seasons[j]
            var divS = document.createElement('div');
            var divSTitle = document.createElement('div');
            divSTitle.className = "seasonTitle";
            divSTitle.innerHTML = season.title;
            div2.appendChild(divSTitle);
            divS.className = "season";
            for (var k = 0; k < season.episodes.length; k++) {
                var episode = season.episodes[k]
                var div3 = document.createElement("div");
                div3.className = "episode";
                if (episode.views > 0) div3.className += " watched"
                div3.dataset['key'] = i + "," + j + "," + k;
                div3.innerHTML = episode.episode;// + ": " + episode.title
                div3.onclick=showTVEpisodeDetail
                divS.appendChild(div3)
                //spn.append(div)        
            }
            div2.appendChild(divS)
        }
        div.appendChild(div2)
    }
    container.append(spn);
    showTVDetail();

}

function showTVEpisodeDetail(event) {
    event.cancelBubble = true;
    showEpisodeDetails(event)
}

function showMovies() {
    var spn = document.createElement("span");
    var container = document.querySelector("#libList");
    for (var i = 0; i < movieList.length; i++) {
        var div = document.createElement("div");
        div.className = 'movie';
        if (movieList[i].views > 0) div.className += " watched"
        div.dataset['key'] = movieList[i].id;
        div.innerHTML = movieList[i].title
        div.onclick=showMovieDetail
        spn.append(div)
    }
    container.append(spn);
    showMovieDetail();

}

function showRecent() {
    var spn = document.createElement("span");
    var container = document.querySelector("#recentList");
    for (var i = 0; i < recentList.length; i++) {
        var mov = recentList[i];
        var div = document.createElement("div");
        div.className = 'movie';
        div.dataset['key'] = mov.id;
        div.innerHTML = mov.title + ' (' + mov.added + ")";
        div.onclick=showRecentDetail;
        spn.append(div);
    }
    container.append(spn);
    showRecentDetail();

}

function showHistory() {
    var container = document.querySelector("#locHistory");
    var tbl = document.createElement("table");
    for (var i = 0; i < movieHistory.length; i++) {
        var mov = movieHistory[i];
        var tr = tbl.insertRow();
        tr.insertCell().innerHTML = mov.vday;
        tr.insertCell().innerHTML = mov.vdate;
        var td = tr.insertCell();
        td.innerHTML = mov.vtime;
        td.style.textAlign = "right";
        td = tr.insertCell();
        td.innerHTML = mov.title + ' ' + mov.other;
        td.style.paddingLeft = ".8em";
    }
    container.innerHTML = "";
    container.append(tbl)

}

function getPosition(list, id) {
    var rslt = -1;
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            rslt = i;
            break;    
        }
    }
    return rslt;
}
function makeCollectionList(colname) {
    var col = movieList.filter(m => {
        if (m.collections == colname) {
            return true;
        }
    }).sort((a,b) => {
        return a.year > b.year ? 1 : -1
    })

    var rslt = "";
    if (col.length > 0) {
        rslt += "<fieldset><legend>" + colname + " Collection (" + col.length + ")</legend>";
        rslt += "<div style='position:relative; max-height: 5.6em; overflow-y: auto;'>"
        rslt += "<ol style='margin-top:0;padding-top:0;margin-bottom:0;padding-botto:0'>";        
        for (var i = 0; i < col.length; i++) {
            rslt += "<li>" + col[i].year + ": " + col[i].title + "</li>";
        }
        rslt += "</ol>"
        rslt += "</div>"
        rslt += "</fieldset>";
    }
    return rslt;
}

function showMovieDetail(event) {
    var rownum = 0;
    if (event != undefined) {
        var key = event.srcElement.dataset["key"];
        rownum = getPosition(movieList, key);
    }
    var mov = movieList[rownum];

    showDetail(
        mov, 
        document.querySelector("#libList"), 
        "table",
        document.querySelector("#locMovieCover"),
        document.querySelector("#movieInfo"), 
        app.priorMovieRow,
        rownum 
    );
    app.priorMovieRow = rownum;
}

function showTVDetail(event) {
    var rownum = 0;
    if (event != undefined) {
        var key = event.srcElement.dataset["key"];
        rownum = getPosition(tvList, key);
    }
    var show = tvList[rownum];

    showDetail(
        show, 
        document.querySelector("#tvList"), 
        "TV",
        document.querySelector("#locTVCover"),
        document.querySelector("#tvInfo"), 
        app.priorShowRow,
        rownum 
    );
    app.priorShowRow = rownum;
}



function showRecentDetail(event) {
    var rownum = 0;
    if (event != undefined) {
        var key = event.srcElement.dataset["key"];
        rownum = getPosition(recentList, key);
    }
    var mov = recentList[rownum];

    showDetail(
        mov, 
        document.querySelector("#recentList"), 
        "div",
        document.querySelector("#locRecentCover"),
        document.querySelector("#recentMovieInfo"), 
        app.priorRecentRow,
        rownum 
    );
    
    app.priorRecentRow = rownum;
}
function formatDuration(dur) {
    var durline = "";
    var hrs = parseInt(dur / (1000 * 60 * 60));
    if (isNaN(hrs)) return "";
    dur -= (hrs * 1000 * 60 * 60);
    var mins = parseInt(dur / (1000 * 60));
    if (mins > 59) {
        mins -= 60;
    }
    var z = (mins < 10 ? "0" : "")
    if (hrs > 0) {
        durline += hrs + "hr ";
    }
    durline += z + mins + "min";
    return durline;
}
function showDetail(mov, lst, typ, img, txtloc, prior, newrow) {
    document.getElementById("episodeInfo").innerHTML = ""; // Clear episode info
    var els = document.getElementsByClassName("currentEpisode");
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove("currentEpisode");
    }

    img.src = "./covers/" + mov.id + ".jpg";

    var info = "<b>" + mov.title + "</b>";
    info += " (#" + mov.id + ")";
    info += "<br>";
    if (mov.year != "") info += "Released in: " + mov.year + ", ";
    info += "Loaded: " + mov.added;
    if (typ != "TV" && mov.lastViewed != undefined && mov.lastViewed != "") info += " <i style='color:tomato'>*** Watched " + mov.lastViewed + " ***</i>"
    if (mov.genres != "") info += "<br>Genre: " + mov.genres;
    if (typ != "TV") {
        durline = formatDuration(mov.duration);
        if (durline != "") {
            durline = "<br>Length: " + durline
        }    
        if (durline == "") {
            info += "<br>Resolution: " + mov.resolution
        } else {
            info += durline + ", Resolution: " + mov.resolution
        }
    }
    if (mov.summary != "") {
        info += "<fieldset><legend>Summary</legend>"
        info += "<div style='position:relative; max-height: 7.6em; overflow-y: auto;'>";
        info += mov.summary;
        info += "</div></fieldset>";
    }
    if (typ == "XXXXXTV") {
        info += "<fieldset><legend>Seasons</legend>";
        info += "<div style='position:relative; max-height: 5.6em; overflow-y: auto;'>";
        info += "<ul>";
        for (var i = 0; i < mov.seasons.length; i++) {
            var season = mov.seasons[i];
            info += "<li>" + season.title;
            info += "<ul>"
            for (var j = 0; j < season.episodes.length; j++) {
                var epi = season.episodes[j]
                info += "<li>" + epi.episode + ": " + epi.title + "</li>"
            }
            info += "</ul></li>";
        }
        info += "</ul>";
        info += "</div>"
        info += "</fieldset>";
    }

    if (mov.actors != "") {
        var list = mov.actors.split(",");
        info += "<fieldset><legend>Actors / Roles (" + list.length + ")</legend>";
        info += "<div style='position:relative; max-height: 5.6em; overflow-y: auto;'>";
        info += "<ul><li>";
        info += list.join("</li><li>");
        info += "</li></ul>";
        info += "</div>";
        info += "</fieldset>";
    }
    if (mov.collections != "") {
        info += makeCollectionList(mov.collections);
    }
    
    txtloc.innerHTML = info;

    if (prior >= 0) {
        var div = lst.children[0].children[prior]
        div.classList.remove("current");
        if (div.children.length > 0) div.children[0].style.display = "none";
    }
    var div = lst.children[0].children[newrow]
    div.classList.add("current"); 
    if (div.children.length > 0) div.children[0].style.display = "block";
}

function showEpisodeDetails(event) {
    var els = document.getElementsByClassName("currentEpisode");
    for (var i = 0; i < els.length; i++) {
        els[i].classList.remove("currentEpisode");
    }
    var el = event.srcElement;
    el.classList.add("currentEpisode")
    var locs = el.dataset["key"].split(",");
    var show = tvList[locs[0]]
    var season = show.seasons[locs[1]]
    var episode = season.episodes[locs[2]]
    var info = "<fieldset><legend>Episode " + episode.episode + ": " + episode.title + "</legend>";
    info += "<table style='width:100%'><tr><td style='vertical-align:top'>"
    info += "<img"
    info += " style='border:2px solid black'"
    info += " height=150 src='./covers/" + season.id + ".jpg'>";
    info += "</td><td style='vertical-align:top'>";
    info += "<div style='margin-left:.2em;position:relative; max-height: 300px; overflow-y: auto;'>";
    if (episode.airdate != "") info += "Original air date: " + episode.airdate + "";
    if (episode.lastViewed != "") info += " <i style='color:tomato;'>*** Watched " + episode.lastViewed + " ***</i><br>"
    var durline = formatDuration(episode.duration);
    info += "<br>Length: " + durline + ", Resolution: " + episode.resolution + "<br>";
    info += "<hr>";
    info += episode.summary;
    info += "</div>";
    info += "</td></tr></table></fieldset>";
    document.getElementById("episodeInfo").innerHTML = info;


}
