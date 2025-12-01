# RHYTHMIC 🎵

A client-side JavaScript music library — a lightweight, responsive music player built with vanilla JavaScript. Explore albums, stream audio, view dynamic playlists, and enjoy interactive playback controls.  

## About  
RHYTHMIC is a simple, client-side music player implemented using plain JavaScript, HTML, and CSS. Music files live in a folder and the library dynamically loads and displays albums/songs.  
It’s ideal for embedding in static sites, personal portfolios, small web apps — anywhere you need a lightweight audio player without heavy dependencies.  

## Features  
- 🎶 Album & Song Management — dynamically fetch and display available music folders as interactive album cards.  
- ▶️ Play / Pause toggle, Next / Previous track navigation.  
- 🔊 Seekbar — clickable seek bar lets users jump to any part of the track.  
- 🔈 Volume control and mute/unmute toggle.  
- ⏱️ Real-time progress display — current playback time and total duration.  
- 📂 Hamburger menu or slide-in navigation menu for song list (ideal for mobile / responsive layout).  

### Installation  
1. Clone the repository:  
    ```bash  
    git clone https://github.com/Adinath-S-Pawar/Rhythmic.git  
    ```  
2. Navigate into the project folder  
    ```bash  
    cd Rhythmic  
    ```  
3. If using a local server, start it (e.g. using VS Code Live Server, `python -m http.server`, or any static-server)  
4. Place your music files (e.g. `.mp3`) inside the `songs/` folder. Maintain optional subfolders to group by album.  
5. Open `index.html` in your browser (or visit via local server)  

## Usage  
Once the page loads, you should see a list of albums (if your `songs/` folder has subfolders), or a list of songs. Click on an album or song to begin playback. Use the UI controls (play/pause, next, previous, volume, seekbar) to control playback.  
 

## Folder Structure  
/Rhythmic
├── img/ 
├── songs/ # your music files (folders or individual files)
├── index.html # home page
├── script.js # main javascript logic
├── style.css # player styles
├── utility.css # utility / helper CSS rules
└── README.md
