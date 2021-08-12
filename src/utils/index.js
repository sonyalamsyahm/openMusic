/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDBToFilteredModel = (item) => ({
  id: item.id,
  title: item.title,
  performer: item.performer,
});

module.exports = { mapDBToModel, mapDBToFilteredModel };
