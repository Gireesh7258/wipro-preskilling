import chalk from "chalk";
import figlet from "figlet";

figlet("Welcome to Node.js", (err, data) => {
  if (err) {
    console.log("Something went wrong...");
    return;
  }
  console.log(chalk.blue(data));
});