import dotenv from 'dotenv';

import db from '@config/database';
import app from './app';


dotenv.config();
const PORT = process.env.PORT || 3001;

async function initServer() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");

    app.listen(PORT, () => {
      console.log(`[Express Server]: App is running at http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}


initServer();