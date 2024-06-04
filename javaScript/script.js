console.log("let write the javaScript code with the enjoy ment")

let currentsong = new Audio();

let mysongs;
let currFolder;

function secondToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}

async function getSongs(folder) {
    currFolder = folder

    let a = await fetch(`/${folder}/`)

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    mysongs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            mysongs.push(element.href.split(`/${folder}/`)[1])
        }
    }




    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of mysongs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
                              <div class="info">
                                  <div>${song.replaceAll("%20", " ")} </div>
                                  <div>Virendra Pal</div>
                              </div>
                              <div class="playnow">
                              <span>Play</span>
                              <img class="invert" src="img/play.svg" alt="">
                              </div> </li>`;
    }

    // Attach an event listener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {
            //   console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return mysongs;

}

const playMusic = (track, pause = false) => {

    currentsong.src = `/${currFolder}/` + track
    if (!pause) {
        currentsong.play()

        play.src = "img/pause.svg"

    }

    document.querySelector(".songinfo").innerHTML = `<h1> ${decodeURI(track)} </h1>`;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)

    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]


        if (e.href.includes("/songs")) {
            // console.log(e.href)
            // console.log(e.href.split("/"))
            // console.log(e.href.split("/").slice(-2))


            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)

            let response = await a.json();
            // console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `   <div data-folder="${folder}" class="card rounded">
            <div class="play">
                <img src="img/playbutton.svg" alt="">
            </div>
            <img class="rounded" src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div> `
        }
    }

    // Load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            let mysongs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(mysongs[0])


        })
    })
}



async function main() {

    // Get the list of all the songs    
    await getSongs("songs/ncs")

    playMusic(mysongs[0], true)

    // Display all the albums on the page

    displayAlbums()


    // Attach an event listener to play, next and previous 
    let play = document.querySelector("#play")
    // console.log(play)

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"

        }
        else {

            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate even
    currentsong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondToMinutesSeconds(currentsong.currentTime)}/${secondToMinutesSeconds(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })


    // Add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    // Add an event listener for hamburger icon

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for cancel button

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    // Add an event listner to previous and next 


    previous.addEventListener("click", () => {
        console.log("previous clicked")
        // console.log(currentsong)
        let index = mysongs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {

            playMusic(mysongs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = mysongs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < (mysongs.length)) {

            playMusic(mysongs[index + 1])
        }
    })

    // add an event to volumebar

    volumebar.addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }

    })

    // Add event listener to mute the track 

    document.querySelector(".volume>img").addEventListener("click", e => {
        // console.log(e.target)
        // console.log(e.target.src)
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentsong.volume = 0;
            volumebar.value = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentsong.volume = .10;
            volumebar.value = 10;
        }

    })




}


main()











