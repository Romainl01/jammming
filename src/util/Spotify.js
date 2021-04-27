const clientId = '8f0f61b25663439d8dc3d108eff38c63';
const redirectURI = 'romainlag-jammming.surge.sh';
let accessToken;

const Spotify = {
  getAccesToken() {
    if (accessToken) {
      return accessToken;
    }
    //check for access token match
    console.log('beenhere');
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      let expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
        const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        window.location = accessURL;

    }
  },
  search(userSearch) {
      const url ='https://api.spotify.com/v1/search?type=track&q=' + userSearch;
      const accessToken = Spotify.getAccesToken();
return fetch(url, {
    headers: {
        Authorization: `Bearer ${accessToken}`
    }
}).then(response => {
    return response.json();
}).then(jsonResponse => {
    if(!jsonResponse.tracks) {
        return [];
    }
    return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
    }));
})

},
savePlaylist(name, URIs) {
if (!name || !URIs.length) {
    return;
}
let accessToken = Spotify.getAccesToken();
const headers = {
    Authorization: `Bearer ${accessToken}`
};
let userID;
fetch('https://api.spotify.com/v1/me', {
    headers: headers
}).then(response => response.json()).then(jsonResponse => {
    userID = jsonResponse.id;
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
    }).then(response => response.json()).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: URIs})
        } )
    })
})
}
  };

export default Spotify;
