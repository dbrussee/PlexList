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
    setTab('R') // Start showing recent
}
function setTab(code) { // M/R/H
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
        var div = document.createElement("div");
        div.className = 'movie';
        div.dataset['key'] = tvList[i].id;
        div.innerHTML = tvList[i].title
        div.onclick=showTVDetail
        spn.append(div)
    }
    container.append(spn);
    showTVDetail();

}

function showMovies() {
    var spn = document.createElement("span");
    var container = document.querySelector("#libList");
    for (var i = 0; i < movieList.length; i++) {
        var div = document.createElement("div");
        div.className = 'movie';
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

function showDetail(mov, lst, typ, img, txtloc, prior, newrow) {
    img.src = "./covers/" + mov.id + ".jpg";

    var info = "<b>" + mov.title + "</b>";
    info += " (#" + mov.id + ")";
    info += "<br>";
    if (mov.year != "") info += "Released in: " + mov.year + ", ";
    info += "Loaded: " + mov.added;
    if (mov.genres != "") info += "<br>Genre: " + mov.genres;
    if (typ == "TV") {
        info += "<fieldset><legend>Seasons</legend>";
        info += "<ul>";
        for (var i = 0; i < mov.seasons.length; i++) {
            info += "<li>" + mov.seasons[i] + "</li>";
        }
        info += "</ul>";
        info += "</fieldset>";
    } else {
        var dur = mov.duration;
        var hrs = parseInt(dur / (1000 * 60 * 60));
        dur -= (hrs * 1000 * 60 * 60);
        var mins = parseInt(dur / (1000 * 60));
        if (mins > 59) {
            mins -= 60;
        }
        var z = (mins < 10 ? "0" : "")
        if (hrs != 0 && mins != 0) {
            info += "<br>Duration: "
            if (hrs != 0) {
                info += hrs + "hr";
                if (mins != 0) info += " ";
             }
             if (mins != 0) info += z + mins + "min";
        }    
    }
    if (mov.summary != "") {
        info += "<fieldset><legend>Summary</legend>" + mov.summary + "</fieldset>";
    }
    if (mov.collections != "") {
        info += makeCollectionList(mov.collections);
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
    
    txtloc.innerHTML = info;
        if (prior >= 0) {
            lst.children[0].children[prior].className = "movie";
        }
        lst.children[0].children[newrow].className = "movie current"; 
}
