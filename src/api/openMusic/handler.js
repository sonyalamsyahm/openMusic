/* eslint-disable no-console */
const ClientError = require('../../exception/ClientError');

/* eslint-disable no-underscore-dangle */
class openMusicHandler {
  constructor(service) {
    this._service = service;
  }

  async postSongHandler(request, h) {
    try {
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
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // Server Error Execption Handler
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      console.error(error);

      response.code(500);
      return response;
    }
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: { songs },
    };
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
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // Server Error Execption Handler
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      console.error(error);

      response.code(500);
      return response;
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      const { songId: id } = request.params;
      const {
        title,
        year,
        performer,
        genre,
        duration,
      } = request.payload;

      await this._service.editMusicById(id, {
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
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // Server Error Execption Handler
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      console.error(error);

      response.code(500);
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
        const response = h.response({
          status: 'fail',
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // Server Error Execption Handler
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      });

      console.error(error);

      response.code(500);
      return response;
    }
  }
}

module.exports = openMusicHandler;
