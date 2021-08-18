const InvariantError = require('../../exception/InvariantError');
const { PostCollaborationsPayloadSchema, DeleteCollaborationsPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = PostCollaborationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = DeleteCollaborationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CollaborationsValidator;
