/* eslint no-underscore-dangle:
  ["error", { "allow": [_playlistsService, _songsService, _validator] }] */

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistsHandler = this.deletePlaylistsHandler.bind(this);
    this.postPlaylistAddSongHandler = this.postPlaylistAddSongHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.PostPlaylistValidator(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    const playlistId = await this._playlistsService.addPlaylist({ name, owner });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: { playlistId },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(owner);
    return {
      status: 'success',
      data: { playlists },
    };
  }

  async deletePlaylistsHandler(request) {
    const { playlistId: id } = request.params;
    const { id: owner } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, owner);
    await this._playlistsService.deletePlaylistById(id);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistAddSongHandler(request, h) {
    this._validator.PostPlaylistAddSongValidator(request.payload);
    const { playlistId: id } = request.params;
    const { songId } = request.payload;
    const { id: owner } = request.auth.credentials;

    // verify only owner (sementara) to add song to playlist
    await this._playlistsService.verifyPlaylistOwner(id, owner);
    // check apakah lagu ada di db songs
    await this._songsService.verifySong(songId);
    // apabila tidak ada error -> lagu ada dan bisa dimasukkan kedalam playlist
    await this._playlistsService.addSongToPlaylist({ playlistId: id, songId });

    /* karena songId merupakan contraint fk dari songs(id) sebenarnya datanya tidak akan masuk
    karena data song(id) tidak ada, tetapi disini dibuat verifySong untuk
    memberikan informasi kepada client bahwa lagu tsb tidak ada/mungkin sudah dihapus */

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }
}

module.exports = PlaylistsHandler;
