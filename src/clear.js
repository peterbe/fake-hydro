import { existsSync, unlinkSync } from "fs";
import chalk from "chalk";

const DB_FILE = "db.json";

main();

async function main() {
  if (existsSync(DB_FILE)) {
    unlinkSync(DB_FILE);
    console.log(chalk.green(`${DB_FILE} deleted`));
  } else {
    console.log(chalk.yellow("No db file to clear"));
  }
}
