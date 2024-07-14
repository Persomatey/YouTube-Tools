const fs = require('fs');
const { google } = require('googleapis');

// Load client secrets from a JSON file downloaded from the Google Cloud Console
const credentials = require('C:/Users/hunte/Desktop/Batch-YouTube-Uploader/credentials_web2.json');

// Set up OAuth2 client
const OAuth2Client = new google.auth.OAuth2(
  credentials.web.client_id,
  credentials.web.client_secret,
  credentials.web.redirect_uris[0]
);

// Scopes required for uploading videos
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

// Path to the video file you want to upload
const videoFilePath = 'C:/Users/hunte/Desktop/Batch-YouTube-Uploader/video.mp4';

// YouTube API version
const youtube = google.youtube({
  version: 'v3',
  auth: OAuth2Client,
});

// Upload video to YouTube
async function uploadVideo() {
  try {
    // Generate an OAuth2 URL and prompt the user to authorize the app
    const authUrl = OAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    // Obtain authorization code from the user
    const code = ''; // Paste the authorization code here after granting permission

    // Exchange authorization code for access token
    const { tokens } = await OAuth2Client.getToken(code);
    OAuth2Client.setCredentials(tokens);

    // Read the video file as a readable stream
    const videoFileStream = fs.createReadStream(videoFilePath);

    // Create the request body
    const requestBody = {
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: 'My YouTube Video',
          description: 'This is a test video upload.',
          tags: ['test', 'node.js', 'youtube api'],
          categoryId: '22', // ID for the category of your choice (e.g., Entertainment)
        },
        status: {
          privacyStatus: 'private', // Set privacy status: public, private, or unlisted
        },
      },
      media: {
        body: videoFileStream,
      },
    };

    // Execute the upload request
    const response = await youtube.videos.insert(requestBody, {
      onUploadProgress: onUploadProgress, // Optional: Track upload progress
    });

    console.log('Video uploaded successfully!');
    console.log('Video ID:', response.data.id);
    console.log('Video URL:', `https://www.youtube.com/watch?v=${response.data.id}`);
  } catch (error) {
    console.error('Error uploading video:', error.message);
  }
}

// Optional: Track upload progress
function onUploadProgress(event) {
  const progress = Math.round((event.bytesRead / event.totalBytes) * 100);
  console.log(`Upload progress: ${progress}%`);
}

// Call the uploadVideo function to start the upload process
uploadVideo();
