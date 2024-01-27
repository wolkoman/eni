export const spotifyRedirectUri = "http://localhost:3000/fiesta/callback";
export const spotifyRecordId = "65b4a27f36343452a1000163"
export const spotifyAuthHeader = 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');