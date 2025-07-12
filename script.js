console.log('HealthCheck');
let currentsong = new Audio();
let songs;
let currentFolder;

async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${currentFolder}`);
    let response = await a.text();
    //console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/songs/${currentFolder}`)[1]); // names
        }
    }

    // display songs in library 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const i of songs) //for of due to  array
    {
        songUL.innerHTML = songUL.innerHTML + `<li>
        
                             <img class="invert" src="img/music.svg" alt="">

                             <div class="info">
                                <div> ${i.replaceAll("%20", " ")} </div>
                                <div>Song Artist</div>
                             </div>

                             <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                             </div>
        
         </li>`
    }

    //Event listener to play songs in library
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", function () {

            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log("Playing:", songName);
            playMusic(songName);
            play.src = "img/pause.svg";
        })

    });

    return songs;
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) { //audio.duration or audio.currentTime may return NaN before the audio metadata is loaded,
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0'); // for example, turning "7" into "07".
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = async (music, pause = false) => {
    currentsong.src = `/songs/${currentFolder}` + music.trim();

    if (!pause) {
        try {
            await currentsong.play();
            play.src = "img/pause.svg";
            const songName = (decodeURIComponent(currentsong.src.split(`/songs/${currentFolder}/`)[1]))
            document.querySelector(".songinfo").innerHTML = songName;
            document.querySelector(".songtime").innerHTML = "00:00";
        }
        catch (err) {
            console.error("Playback failed:", err);
        }
    }
};

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;

    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    for (let e of anchors) {
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0];
            //console.log(folder)

            //meta data
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <img src="songs/${folder}/cover.jpg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                    <div class="play">
                        <img src="img/play-button-green-icon.svg" alt="">
                    </div>
                </div>`;
        }
    }

    //load playlist of card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })

}

async function main() {
    songs = await getSongs("ncs");
    //console.log(songs);
    playMusic(songs[0], true);       // sets the current song to first song but doesn't play it

    displayAlbums();

    //event listener to play song
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg";

            if (!document.querySelector(".songinfo").innerHTML.trim()) {
                const songName = (decodeURIComponent(currentsong.src.split(`/songs/${currentFolder}/`)[1]))
                document.querySelector(".songinfo").innerHTML = songName;
                document.querySelector(".songtime").innerHTML = "00:00";
            }
        }
        else {
            currentsong.pause();
            play.src = "img/play.svg";
        }
    })

    //event listener to songtime 
    currentsong.addEventListener("timeupdate", () => {
        //console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)} `
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentTime = (clickX / rect.width) * 100;

        currentsong.currentTime = (currentsong.duration * percentTime) / 100

    })

    //event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", e => {
        document.querySelector(".left").style.left = "0"
    })

    //event listener to close button (close hamburger)
    document.querySelector(".close").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-100%"
    })

    //event listener to previous and next song

    function getCurrentSongIndex(songs, currentsong) {
        let currentFile = '/' + currentsong.src.split('/').pop();
        return songs.indexOf(currentFile);
    }

    previous.addEventListener("click", e => {

        console.log('previous button clicked');
        //console.log(currentsong);
        let index = getCurrentSongIndex(songs, currentsong);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }

    })

    next.addEventListener("click", e => {

        console.log('next button clicked');

        //console.log(songs.length);
        let index = getCurrentSongIndex(songs, currentsong);
        if (index + 1 <= songs.length) {
            playMusic(songs[index + 1]).catch(err => {
                console.error("Failed to play next song:", err);

            });
        }

    })

    //event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentsong.volume = parseInt(e.target.value) / 100

    })

    // event listener to mute
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentsong.volume = 0.3;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 30;
        }

    })

}

main()

