# YouTube-Tools

This repo is mainly for some tools I've built that I'm using personally to help display channel growth. 

### Instructions 
- Fill the `playlistIDs.json` file with as many platlists as you want. Give them a name, and copy/paste the playlist ID. 
- Include the name of the playlist you want currently tracked as the `playlistName` in the `config.json` file. 
- Right-click > Open with > browser see the playlist visualized 

### Tools 
<i> there's only the one so far </i> 

- Playlist Views Visualizer
	- Displays the amount of viewers per video in a giveo playlist. 
	- Videos tht released on Fri-Sun are displayed in black, others are displayed in grey. 
	- Provide the PlaylistID in the `playlistID` variable. 
	- Currently this is using my personal Google API key. I think that's fine for now? I may have to change that if everyone breaks stuff though. 
		- In the future, I'll include a variable where you can put in your own API key.
- Batch Uploader
  	- Uploads every file in a folder to a YouTube channel
  	- Still in development 

### Roadmap 
- Graph to display subscriber across a playlist 
- Graph to display likes in a playlist 
- Graph to display average views across all videos by day of the week (Sun-Sat) 
- Graph to display average subscriber growth across all videos by day of the week (Sat-Sun) 
