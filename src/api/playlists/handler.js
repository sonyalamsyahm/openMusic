/* eslint no-underscore-dangle:
  ["error", { "allow": [_playlistsService, _songsService, _validator] }] */
const ClientError = require('../../exception/ClientError');

class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistsHandler = this.deletePlaylistsHandler.bind(this);
    this.postPlaylistAddSongHandler = this.postPlaylistAddSongHandler.bind(this);
    this.getPlaylistSongsByPlaylistId = this.getPlaylistSongsByPlaylistId.bind(this);
    this.deletePlaylistSongBySongId = this.deletePlaylistSongBySongId.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
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
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(credentialId);
      return {
        status: 'success',
        data: { playlists },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistsHandler(request, h) {
    try {
      const { playlistId: id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.deletePlaylistById(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async postPlaylistAddSongHandler(request, h) {
    try {
      this._validator.PostPlaylistAddSongValidator(request.payload);
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      // verify only owner (sementara) to add song to playlist
      // await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      // owner & collaboration verify to add song
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);

      // check apakah lagu ada di db songs
      await this._songsService.verifySong(songId);
      // apabila tidak ada error -> lagu ada dan bisa dimasukkan kedalam playlist
      await this._playlistsService.addSongToPlaylist({ playlistId, songId });

      /* karena songId merupakan contraint fk dari songs(id) sebenarnya datanya tidak akan masuk
      karena data song(id) tidak ada, tetapi disini dibuat verifySong untuk
      memberikan informasi kepada client bahwa lagu tsb tidak ada/mungkin sudah dihapus */

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongsByPlaylistId(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._playlistsService.getSongsByPlaylistId(playlistId);

      return {
        status: 'success',
        data: { songs },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongBySongId(request, h) {
    try {
      this._validator.DeletePlaylistSongValidator(request.payload);

      const { songId } = request.payload;
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
      await this._songsService.verifySong(songId);
      await this._playlistsService.deletePlaylistSongBySongId({ playlistId, songId });

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        throw error;
      }

      // Server Error
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistsHandler;
