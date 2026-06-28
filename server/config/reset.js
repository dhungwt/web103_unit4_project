import "./dotenv.js";
import pg from "pg";
import parksData from "../data/parks.js";

// const client = new pg.Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const seedParksTable = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await client.connect();
    console.log("✅ Connected!");

    console.log("🏗️ Creating parks table...");
    await client.query(`
      DROP TABLE IF EXISTS parks CASCADE;
      CREATE TABLE parks (
        id SERIAL PRIMARY KEY,
        park_name VARCHAR(255) NOT NULL,
        is_family_friendly BOOLEAN NOT NULL,
        ride VARCHAR(100) NOT NULL,
        food VARCHAR(100) NOT NULL,
        attraction VARCHAR(100) NOT NULL,
        total_price INT NOT NULL,
        img_url VARCHAR(255) NOT NULL
      );
    `);
    console.log("🎉 parks table created successfully");

    console.log("🌱 Seeding records...");
    for (const park of parksData) {
      await client.query(
        `INSERT INTO parks (park_name, is_family_friendly, ride, food, attraction, total_price, img_url) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          park.park_name,
          park.is_family_friendly,
          park.ride,
          park.food,
          park.attraction,
          park.total_price,
          park.img_url,
        ],
      );
      console.log(`🎉 ${park.park_name} seeded successfully`);
    }
  } catch (err) {
    console.error("⚠️ Error:", err.message);
  } finally {
    console.log("🔌 Closing connection...");
    await client.end();
  }
};

seedParksTable();
