let app = {
    priorMovieRow: -1,
    currentTab: '',
    loadedTabs: {}
}

function init() {
    document.querySelector("#movieCount").innerHTML = movieList.length
    document.querySelector("#recentCount").innerHTML = recentList.length
    document.querySelector("#historyCount").innerHTML = movieHistory.length
    setTab('R') // Start showing recent
}
function setTab(code) { // M/R/H
    document.querySelector("#locMovies").style.display = (code == 'M' ? "" : "none");
    document.querySelector("#locRecent").style.display = (code == 'R' ? "" : "none");
    document.querySelector("#locHistory").style.display = (code == 'H' ? "" : "none");

    document.querySelector("#tabMovies").className = (code != 'M' ? "tab" : "tab current");
    document.querySelector("#tabRecent").className = (code != 'R' ? "tab" : "tab current");
    document.querySelector("#tabHistory").className = (code != 'H' ? "tab" : "tab current");

    if (app.loadedTabs[code] == undefined) {
        if (code == 'M') { showMovies(); }
        if (code == 'R') { showRecent(); }
        if (code == 'H') { showHistory(); }
        app.loadedTabs[code] = true;
    }

    app.currentTab = code;
}

function showMovies() {
    var spn = document.createElement("span");
    var container = document.querySelector("#libList");
    for (var i = 0; i < movieList.length; i++) {
        var div = document.createElement("div");
        div.className = 'movie';
        div.dataset['num'] = i;
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
        div.dataset['num'] = i;
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

function showMovieDetail(event) {
    var num = 0;
    if (event != undefined) {
        num = event.srcElement.dataset["num"];
    }
    var mov = movieList[num];

    showDetail(
        mov, 
        document.querySelector("#libList"), 
        "table",
        document.querySelector("#locMovieCover"),
        document.querySelector("#movieInfo"), 
        app.priorMovieRow,
        num 
    );

    // document.querySelector("#locMovieCover").src = "./covers/" + mov.id + ".jpg";

    // var info = "<b>" + mov.title + "</b>";
    // info += "<br>Released in: " + mov.year;
    // info += ", Loaded: " + mov.added;
    // info += "<br>Genre: " + mov.genres;
    // var dur = mov.duration;
    // var hrs = parseInt(dur / (1000 * 60 * 60));
    // dur -= (hrs * 1000 * 60 * 60);
    // var mins = parseInt(dur / (1000 * 60));
    // if (mins > 59) {
    //     mins -= 60;
    // }
    // var z = (mins < 10 ? "0" : "")
    // info += "<br>Duration: " + hrs + ":" + z + mins;
    // if (mov.collections != "") info += "<br>Collection: " + mov.collections;
    // if (mov.actors != "") {
    //     info += "<ul><li>";
    //     info += mov.actors.split(", ").join("</li><li>");
    //     info += "</li></ul>";
    // }
    // info += "<fieldset><legend>Summary</legend>" + mov.summary + "</fieldset>";
    // document.querySelector("#movieInfo").innerHTML = info;
    // var container = document.querySelector("#libList");
    // if (app.priorMovieRow >= 0) {
    //     container.children[0].children[app.priorMovieRow].className = "movie";
    // }
    // container.children[0].children[num].className = "movie current";
    app.priorMovieRow = num;
}

function OLDshowMovieDetail(event) {
    var num = 0;
    if (event != undefined) {
        num = event.srcElement.dataset["num"];
    }
    var mov = movieList[num];

    document.querySelector("#locMovieCover").src = "./covers/" + mov.id + ".jpg";

    var info = "<b>" + mov.title + "</b>";
    info += "<br>Released in: " + mov.year;
    info += ", Loaded: " + mov.added;
    info += "<br>Genre: " + mov.genres;
    var dur = mov.duration;
    var hrs = parseInt(dur / (1000 * 60 * 60));
    dur -= (hrs * 1000 * 60 * 60);
    var mins = parseInt(dur / (1000 * 60));
    if (mins > 59) {
        mins -= 60;
    }
    var z = (mins < 10 ? "0" : "")
    info += "<br>Duration: " + hrs + ":" + z + mins;
    if (mov.collections != "") info += "<br>Collection: " + mov.collections;
    if (mov.actors != "") {
        info += "<ul><li>";
        info += mov.actors.split(", ").join("</li><li>");
        info += "</li></ul>";
    }
    info += "<fieldset><legend>Summary</legend>" + mov.summary + "</fieldset>";
    document.querySelector("#movieInfo").innerHTML = info;
    var container = document.querySelector("#libList");
    if (app.priorMovieRow >= 0) {
        container.children[0].children[app.priorMovieRow].className = "movie";
    }
    container.children[0].children[num].className = "movie current";
    app.priorMovieRow = num;
}

function showRecentDetail(event) {
    var num = 0;
    if (event != undefined) {
        num = event.srcElement.dataset["num"];
    }
    var mov = recentList[num];

    showDetail(
        mov, 
        document.querySelector("#recentList"), 
        "div",
        document.querySelector("#locRecentCover"),
        document.querySelector("#recentMovieInfo"), 
        app.priorRecentRow,
        num 
    );
    
    app.priorRecentRow = num;
}

function showDetail(mov, lst, typ, img, txtloc, prior, newrow) {
    img.src = "./covers/" + mov.id + ".jpg";

    var info = "<b>" + mov.title + "</b>";
    info += " (#" + mov.id + ")";
    info += "<br>";
    if (mov.year != "") info += "Released in: " + mov.year + ", ";
    info += "Loaded: " + mov.added;
    if (mov.genres != "") info += "<br>Genre: " + mov.genres;
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
    if (mov.collections != "") info += "<br>Collection: " + mov.collections;
    if (mov.actors != "") {
        info += "<ul><li>";
        info += mov.actors.split(", ").join("</li><li>");
        info += "</li></ul>";
    }
    
    if (mov.summary != "") {
        info += "<fieldset><legend>Summary</legend>" + mov.summary + "</fieldset>";
    }
    txtloc.innerHTML = info;
    // if (typ == "table") {
        if (prior >= 0) {
            lst.children[0].children[prior].className = "movie";
        }
        lst.children[0].children[newrow].className = "movie current";    
    // } else if (typ == "div") {
        // if (prior >= 0) {
            // lst.children[prior].className = "movie";
        // }
        // lst.children[newrow].className = "movie current";    
    // }
}
