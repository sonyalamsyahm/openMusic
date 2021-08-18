const ClientError = require('../../exception/ClientError');

/* eslint-disable no-underscore-dangle */
class OpenMusicHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    try {
      // validate data payload
      this._validator.validateSongPayload(request.payload);
      const {
        title,
        year,
        performer,
        genre,
        duration,
      } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        performer,
        genre,
        duration,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: { songId },
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

  async getSongsHandler(h) {
    try {
      const songs = await this._service.getSongs();
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

  async getSongByIdHandler(request, h) {
    try {
      const { songId: id } = request.params;
      const song = await this._service.getSongById(id);

      const response = h.response({
        status: 'success',
        data: { song },
      });

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

  async putSongByIdHandler(request, h) {
    try {
      // validate data payload
      this._validator.validateSongPayload(request.payload);

      const { songId: id } = request.params;
      const {
        title,
        year,
        performer,
        genre,
        duration,
      } = request.payload;

      await this._service.editSongById(id, {
        title,
        year,
        performer,
        genre,
        duration,
      });

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil diperbarui',
      });

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

  async deleteSongByIdHandler(request, h) {
    try {
      const { songId: id } = request.params;
      await this._service.deleteSongById(id);

      const response = h.response({
        status: 'success',
        message: 'lagu berhasil dihapus',
      });

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
}

module.exports = OpenMusicHandler;
