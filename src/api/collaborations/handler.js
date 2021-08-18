/* eslint no-underscore-dangle:
  ["error", { "allow": [_collaborationsService,  _validator, _playlistsService] }] */

const ClientError = require('../../exception/ClientError');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validatePostCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
      const collaborationId = await this._collaborationsService.addCollaboration(
        playlistId, userId,
      );

      const response = h.response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: { collaborationId },
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

  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateDeleteCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: owner } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, owner);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
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

module.exports = CollaborationsHandler;
