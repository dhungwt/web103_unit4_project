import { pool } from "../config/database.js";

const getParks = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM parks ORDER BY id ASC");
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const getParkById = async (req, res) => {
  try {
    const selectQuery = `
      SELECT park_name, is_family_friendly, ride, food, attraction, total_price, img_url
      FROM parks
      WHERE id=$1
    `;
    const parkId = req.params.parkId;
    const results = await pool.query(selectQuery, [parkId]);
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const createPark = async (req, res) => {
  try {
    const {
      park_name,
      is_family_friendly,
      ride,
      food,
      attraction,
      total_price,
      img_url,
    } = req.body;
    const results = await pool.query(
      `
      INSERT INTO parks (park_name, is_family_friendly, ride, food, attraction, total_price, img_url)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        park_name,
        is_family_friendly,
        ride,
        food,
        attraction,
        total_price,
        img_url,
      ],
    );
    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const updatePark = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      park_name,
      is_family_friendly,
      ride,
      food,
      attraction,
      total_price,
      img_url,
    } = req.body;
    const results = await pool.query(
      `
          UPDATE parks SET park_name = $1, is_family_friendly = $2, ride = $3, food = $4, attraction = $5, total_price = $6, img_url = $7 WHERE id = $8`,
      [
        park_name,
        is_family_friendly,
        ride,
        food,
        attraction,
        total_price,
        img_url,
        id,
      ],
    );
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

const deletePark = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const results = await pool.query("DELETE FROM parks WHERE id = $1", [id]);
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default {
  getParks,
  getParkById,
  createPark,
  updatePark,
  deletePark,
};
