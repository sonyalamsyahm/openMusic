const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const PlaylistAddSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const PlaylistDeleteSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  PlaylistAddSongPayloadSchema,
  PlaylistDeleteSongPayloadSchema,
};
