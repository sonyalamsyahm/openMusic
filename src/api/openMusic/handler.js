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
        title = 'untilted',
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
}

module.exports = openMusicHandler;
