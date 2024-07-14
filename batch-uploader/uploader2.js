const { google } = require('googleapis');
const { readFileSync } = require('fs');
const fs = require('fs');

// const SERVICE_ACCOUNT_KEY_FILE = 'C:/Users/hunte/Desktop/Batch-YouTube-Uploader/positive-apex-390705-7c75d3b631d7.json';
const SERVICE_ACCOUNT_KEY_FILE = 'C:/Users/hunte/Desktop/Batch-YouTube-Uploader/positive-apex-390705-664564c1839d.json';
// const SERVICE_ACCOUNT_KEY_FILE = 'C:/Users/hunte/Desktop/Batch-YouTube-Uploader/client_secret_1093447104454-v1478q29ka79527200cdak1t1vrcgdbr.apps.googleusercontent.com.json';
const VIDEO_PATH = 'C:/Users/hunte/Desktop/Batch-YouTube-Uploader/video.mp4';
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

const uploadVideo = async () => {
	try {
	  const auth = new google.auth.GoogleAuth({
		keyFile: SERVICE_ACCOUNT_KEY_FILE,
		scopes: SCOPES,
	  });
  
	  const authClient = await auth.getClient();
	  const youtube = google.youtube({
		version: 'v3',
		auth: authClient,
	  });
  
	  const videoMetadata = {
		snippet: {
		  title: 'Your video title',
		  description: 'Your video description',
		  tags: ['tag1', 'tag2'],
		},
		status: {
		  privacyStatus: 'private', // Change this to 'public' if desired
		},
	  };
  
	  const requestParams = {
		part: 'snippet,status',
		media: {
		  body: fs.createReadStream(VIDEO_PATH),
		},
		notifySubscribers: false,
	  };
  
	  const response = await youtube.videos.insert(requestParams, {
		onUploadProgress: (event) => {
		  const progress = Math.round((event.bytesRead / event.bytesTotal) * 100);
		  console.log(`Upload progress: ${progress}%`);
		},
	  });
  
	  console.log('Video uploaded successfully!');
	  console.log('Video ID:', response.data.id);
	  console.log('Video URL:', `https://www.youtube.com/watch?v=${response.data.id}`);
	} catch (err) {
	  console.log('Error uploading video:', err);
	}
  };
  
  uploadVideo();
