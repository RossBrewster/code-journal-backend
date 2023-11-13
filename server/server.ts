/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express, { application } from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
      select *
      from entries
    `;
    const result = await db.query(sql);
    const entries = result.rows;
    res.json(entries);
  } catch (error) {
    console.error(error);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const entryId = Number(req.params.entryId);
    if (!Number.isInteger(entryId) || entryId <= 0) {
      throw new ClientError(400, 'EntryId must be a positive interger.');
    }
    const params = [entryId];
    const sql = `
      select *
      from "entries"
      where "entryId" = $1
    `;
    const result = await db.query(sql, params);
    const entries = result.rows;
    res.json(entries);
  } catch (error) {
    console.error(error);
  }
});

app.post('/api/entries', async (req, res, next) => {
  const { photoUrl, notes, title } = req.body;
  const params = [photoUrl, notes, title];
  const sql = `
    insert into "entries"("photoUrl", "notes", "title")
      values($1, $2, $3)
      returning *
  `;
  const result = await db.query(sql, params);
  const entry = result.rows;
  res.json(entry);
});

app.put('/api/entries/:entryID', async (req, res, next) => {
  const { photoUrl, notes, title } = req.body;
  const entry = req.params.entryID;
  const params = [photoUrl, notes, title, entry];

  const sql = `
    update "entries"
      set "photoUrl" = $1,
          "notes" = $2,
          "title" = $3
      where "entryId" = $4
      returning *
  `;
  const result = await db.query(sql, params);
  const updatedEntry = result.rows;
  res.json(updatedEntry);
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
