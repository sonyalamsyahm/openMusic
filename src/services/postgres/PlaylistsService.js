/* eslint no-underscore-dangle: ["error", { "allow": ["_pool"] }] */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const AuthorizationError = require('../../exception/AuthorizationError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlists-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, username FROM playlists 
      LEFT JOIN users ON playlists.owner = users.id
      WHERE playlists.owner = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak dtemukan');
    }

    const ownerId = result.rows[0].owner;

    if (ownerId !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
    const id = `ps-${nanoid(16)}`;
    /* apakah perlu query untuk check duplikasi? data tidak akan masuk walau duplikat
    karena ada contstrant unique untuk song_id dan playlist_id, tetapi status code
    akan menjadi 500 dan message menjadi kesalahan internal bukan dari client */
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    await this._pool.query(query);
  }

  async getSongsByPlaylistId(id) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      LEFT JOIN songs ON playlistsongs.song_id = songs.id
      WHERE playlistsongs.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistSongBySongId({ playlistId, songId }) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $1 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. id tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
