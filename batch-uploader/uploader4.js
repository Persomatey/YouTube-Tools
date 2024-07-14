const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// Set the path to your video file
const VIDEO_PATH = 'uploads/video.mp4';
const VIDEO_FOLDER_PATH = 'uploads';

// Set the path to your client_secret.json file
// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'positive-apex-390705-7c75d3b631d7.json';

// Set up OAuth2 client
const auth = new google.auth.OAuth2(
	'1093447104454-v1478q29ka79527200cdak1t1vrcgdbr.apps.googleusercontent.com',
	'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',
	'http://localhost:8000/oauth2callback'
  );

  const authUrl = auth.generateAuthUrl({
	access_type: 'offline',
	scope: ['https://www.googleapis.com/auth/youtube.upload']
  });
  
//   console.log('Authorize this app by visiting the following URL:');
//   console.log(authUrl);
  
  // After authorization, set the access token
  auth.setCredentials({
	access_token: 'ya29.a0AWY7CklsP7v9_cQ0gw15A2qA1Nx-60oajr2xIl2pSnggNVI4ryz334NYhmGkAscXyx2MkYVm5519w8lZPn_jmu3g5-N3bxZK11cOaNlvU6CKDPaOvMsAm2kuZvdiG2LfX5KoEeYVGlDeW5_5eaPbcRGKWUb3aCgYKAWISARMSFQG1tDrp2Y71KK8A2p046XXXDIqCXA0163',
	refresh_token: '1//06E3Di6Ov7G_0CgYIARAAGAYSNwF-L9IrFMsojhFk5AhbyLbQV7f75KnKvxDp7c3ADh0juFd8oXthyw2i83TcMa7WKOTE_PPTDsU'
  });
  
  // Create a new YouTube Data API client
  const youtube = google.youtube({
	version: 'v3',
	auth
  });

// Upload video to YouTube


function readCSVFilesFromFolder(folderPath) 
{
	return new Promise((resolve, reject) => 
	{
		fs.readdir(folderPath, (err, files) => 
		{
			if (err) 
			{
				reject(err);
				return;
			}

			const csvFiles = files.filter((file) => path.extname(file).toLowerCase() === '.csv');

			const promises = csvFiles.map((file) => 
			{
				const filePath = path.join(folderPath, file);
				return readCSVFile(filePath);
			});

			Promise.all(promises)
			.then((results) => 
			{
				resolve(results);
			})
			.catch((error) => 
			{
				reject(error);
			});
		});
	});
}
  
function readCSVFile(filePath) 
{
	return new Promise((resolve, reject) => 
	{
		fs.readFile(filePath, 'utf8', (err, data) => 
		{
			if (err) 
			{
				reject(err);
				return;
			}

			resolve(data);
		});
	});
}

function parseCSV(csv) 
{
	const rows = csv.split('\n');
	const columns = [];
  
	for (let i = 0; i < rows.length; i++) 
	{
		const values = parseCSVRow(rows[i]);
		columns.push(values);
	}
  
	return columns;
}
  
function parseCSVRow(row) 
{
	const values = [];
	let currentVal = '';
	let withinQuotes = false;
  
	for (let i = 0; i < row.length; i++) 
	{
		const char = row[i];
	
		if (char === '"') 
		{
			withinQuotes = !withinQuotes;
		} 
		else if (char === ',' && !withinQuotes) 
		{
			values.push(currentVal.trim());
			currentVal = '';
		} 
		else 
		{
			currentVal += char;
		}
	}
  
	values.push(currentVal.trim());
  
	return values;
}

function uploadMultipleVideos(str)
{
	console.log("Uploading videos..."); 

	fs.readdir(VIDEO_FOLDER_PATH, (err, files) => 
	{
		var i = 0; 

        if (err) {
			console.error('Error reading video folder:', err.message);
			return;
        }

		var csvData = parseCSV(str);

        // Upload each video file in the folder
        files.forEach((file) => 
		{
			// i++; 
        	const videoPath = `${VIDEO_FOLDER_PATH}/${file}`;

			// Set the desired title for each video
        	const title = csvData[i][2] + " #shorts"; 

			// Set the desired description for each video
        	const description = 'Subscribe for more spooky stories respoken\nhttps://www.youtube.com/channel/UCGkdNPfa4Xk2U-XbxlbN4Eg?sub_confirmation=1'; 

			// Set the desired tags for each video 
			const tags = ['shorts', 'spooky story','scary story','ghost story','cryptid story','criptid story','alien story','horror story','horror movies','scary movies','video,sharing','camera phone','video phone','free','upload','eerie'];
			
        	uploadVideo(videoPath, title, description, tags); 
			//console.log(`\nUploading video ${i++} \n` + videoPath + "\n" + title + "\n" + description + "\n" + tags + "\n"); 
        });
	});
}

const uploadVideo = async (videoPath, title, description, tags) => 
{
	// console.log(videoPath + "\n" + title + "\n" + description + "\n" + tags + "\n\n"); 

	try 
	{
		/*
		const res = await youtube.videos.insert({
			part: 'snippet,status',
			requestBody: {
				snippet: {
					title: 'Your Video Title',
					description: 'Your Video Description',
					tags: ['tag1', 'tag2'],
				},
				status: {
					privacyStatus: 'private', // Set the privacy status here (public, private, or unlisted)
				},
			},
			media: {
				body: fs.createReadStream(VIDEO_PATH),
			},
		});
		*/

		const res = await youtube.videos.insert(
		{
			part: 'snippet,status',
			requestBody: {
				snippet: {
					title: title,
					description: description,
					tags: tags,
				},
				status: {
					privacyStatus: 'private', // Set the privacy status here (public, private, or unlisted)
				},
			},
			media: {
				body: fs.createReadStream(videoPath),
			},
		});

		console.log(res); 
		console.log('Video uploaded successfully! Video ID:', res.data.id);
	} 
	catch (err) 
	{
		console.error('Error uploading video:', err.message);
	}
};

function orderOfOperations()
{
	const folderPath = 'csv';

	readCSVFilesFromFolder(folderPath)
	.then((csvDataArray) => {
		uploadMultipleVideos(csvDataArray[0]); 
	})
	.catch((error) => {
		console.error('Error reading CSV files:', error);
	});
}

orderOfOperations(); 