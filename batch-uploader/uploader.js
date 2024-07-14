const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const multer = require('multer');
const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8000;

const CLIENT_ID = '1093447104454-v1478q29ka79527200cdak1t1vrcgdbr.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];

const auth = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage }).single('video');

app.get('/oauth2callback', (req, res) => {
  // OAuth 2.0 callback handling code
  // ...
  // Example:
  res.send('OAuth 2.0 callback received!');
});

app.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Error uploading video:', err);
      res.status(500).send('Error uploading video');
      return;
    }

    console.log('Video file uploaded successfully!');
    const videoPath = `./uploads/${req.file.originalname}`;

    try {
      await uploadVideo(videoPath);
      res.send('Video uploaded successfully!');
    } catch (err) {
      console.error('Error uploading video:', err);
      res.status(500).send('Error uploading video');
    }
  });
});

const authorize = () => {
	return new Promise((resolve, reject) => {
	  const authUrl = auth.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	  });
	  console.log('Authorize this app by visiting this URL:', authUrl);
	  const rl = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout,
	  });
	  rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		auth.getToken(code, (err, token) => {
		  if (err) {
			reject(err);
			return;
		  }
		  auth.setCredentials(token);
		  resolve();
		});
	  });
	});
  };

const uploadVideo = async (videoPath) => {
	try {
	  await authorize();
	  const youtube = google.youtube({ version: 'v3', auth });
  
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
  
	  const res = await youtube.videos.insert(
		{
		  part: 'snippet,status',
		  media: {
			body: fs.createReadStream(videoPath),
		  },
		  notifySubscribers: false,
		}
	  );
  
	  const videoId = res.data.id;
	  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  
	  console.log('Video uploaded successfully!');
	  console.log('Video URL:', videoUrl);
	} catch (err) {
	  console.log('Error:', err);
	}
  };

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
