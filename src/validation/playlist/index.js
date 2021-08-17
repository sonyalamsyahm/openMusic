const { PlaylistPayloadSchema, PlaylistAddSongPayloadSchema, PlaylistDeleteSongPayloadSchema } = require('./schema');
const InvariantError = require('../../exception/InvariantError');

const PlaylistsValidator = {
  PostPlaylistValidator: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  PostPlaylistAddSongValidator: (payload) => {
    const validationResult = PlaylistAddSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  DeletePlaylistSongValidator: (payload) => {
    const validationResult = PlaylistDeleteSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
