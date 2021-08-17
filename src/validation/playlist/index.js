const { PlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../exception/InvariantError');

const PlaylistsValidator = {
  PostPlaylistValidator: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
