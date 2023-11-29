import { createHmac } from "crypto";

import express from "express";
import chalk from "chalk";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cors from "cors";

const app = express();
const PORT = parseInt(process.env.PORT || "7777");
const VERBOSE = Boolean(JSON.parse(process.env.VERBOSE || "false"));

// So we can use in client-side Hydro sending
app.use(cors());

app.use(express.raw({ type: "*/*" }));

const DB_FILE = "db.json";
const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, { events: [] });
await db.read();

app.get("/*", (req, res) => {
  console.log(req.url);
  const msg = `GETTING to ${req.url.slice(1)}`;
  console.log(msg);
  res.send(msg);
});

app.post("/*", (req, res) => {
  const msg = `POSTING to ${req.url.slice(1)}`;
  const body = req.body.toString("utf-8");
  const bodyData = JSON.parse(body);
  const secret = process.env.HYDRO_SECRET;
  if (secret) {
    const token = createHmac("sha256", secret).update(req.body).digest("hex");
    if (req.headers.authorization !== `Hydro ${token}`) {
      console.warn(
        chalk.red(`authorization header does not match '${secret}'`),
      );
      return res.status(403).send("Bad token");
    }
  }
  printAggregates(db.data.events);

  console.log("Event incoming", new Date());
  console.log(bodyData);
  if (VERBOSE) {
    for (const { value } of bodyData.events) {
      console.log(JSON.parse(value));
    }
  }

  db.data.events.push({
    uri: req.url.slice(1),
    date: new Date(),
    body: bodyData,
  });

  db.write().then(() => {
    console.log("Reported into", DB_FILE, new Date());
  });
  // console.log(msg);
  res.send(msg);
});

function printAggregates(events) {
  console.log("");
  for (const [date, counts] of countSchemas(events)) {
    console.log(
      `Counts ${chalk.bold(date)} ${chalk.dim("(delete db.json to reset)")}`,
    );
    for (const [schema, count] of Object.entries(counts)) {
      console.log(
        `  ${chalk.green(schema.padEnd(25))}  ${chalk.yellowBright(
          `${count}`.padStart(4),
        )}`,
      );
    }
  }
}

function countSchemas(events) {
  const byDay = {};
  for (const { date, body } of events) {
    const dateStr =
      typeof date === "string"
        ? date.split("T")[0]
        : date.toISOString().split("T")[0];
    if (!(dateStr in byDay)) {
      byDay[dateStr] = {};
    }
    const count = byDay[dateStr];
    for (const { schema } of body.events) {
      count[schema] = (count[schema] || 0) + 1;
    }
  }
  // Display most recent day first
  return Object.entries(byDay).sort((a, b) => b[0].localeCompare(a[0]));
}

app.listen(PORT, () => {
  console.log(`Fake Hydro app listening on port ${PORT}`);
  printAggregates(db.data.events);
});
