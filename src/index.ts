import * as fs from "fs";
import readlineSync from "readline-sync";
import Cipher from "wcipher";

async function main() {
  const args = process.argv.slice(2); // Get CLI arguments
  if (args.length !== 3) {
    console.error("Usage: wcipher <encrypt|decrypt> <input-file> <output-file>");
    process.exit(1);
  }

  const [command, inputFile, outputFile] = args;

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found.`);
    process.exit(1);
  }

  if (command !== "encrypt" && command !== "decrypt") {
    console.error('Error: First argument must be "encrypt" or "decrypt".');
    process.exit(1);
  }


  const password = readlineSync.question('Enter password: ', {
    hideEchoBack: true // The typed text on screen is hidden by `*` (default).
  });
  console.log("\nProcessing...");

  try {
    const inputData = fs.readFileSync(inputFile);
    let outputData: Uint8Array;

    if (command === "encrypt") {
      outputData = await Cipher.encrypt(password, inputData);
    } else {
      outputData = await Cipher.decrypt(password, inputData);
    }

    fs.writeFileSync(outputFile, outputData);
    console.log(`Success: ${command}ed file saved to "${outputFile}"`);
  } catch (error) {
    let message: string;
    if ('string' === typeof error) {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = `${error}`;
    }
    console.error(`Error during ${command}:`, message);
    process.exit(1);
  }
}

main().catch(console.error);
