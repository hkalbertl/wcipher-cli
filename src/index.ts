import { Command } from "commander";
import * as fs from "fs";
import path from "path";
import pkg from 'enquirer';
const { prompt } = pkg;
import packageJson from "../package.json" with { type: "json" };
import WCipher from "wcipher";

/**
 * The program entry point, used for defining commander settings.
 */
async function main() {
  // Define the command.js
  const program = new Command();
  program
    .name("wcipher")
    .description(packageJson.description)
    .version(packageJson.version);

  program
    .command("encrypt")
    .argument("<input>", "Input file or directory")
    .argument("<outputDir>", "Output directory")
    .action(async (input, outputDir) => {
      console.log(`Encrypting ${input} to ${outputDir}`);
      return await startCommand(true, input, outputDir);
    });

  program
    .command("decrypt")
    .argument("<input>", "Input file or directory")
    .argument("<outputDir>", "Output directory")
    .action(async (input, outputDir) => {
      console.log(`Decrypting ${input} to ${outputDir}`);
      return await startCommand(false, input, outputDir);
    });

  program.parse(process.argv);
}

/**
 * Start the main logic.
 * @param isEncrypt Is encryption or not.
 * @param inputPath Input file or directory.
 * @param outputDir Output directory.
 */
async function startCommand(isEncrypt: boolean, inputPath: string, outputDir: string) {
  // Make sure input file / directory exists
  if (!fs.existsSync(inputPath)) {
    console.error("Error: Input file or directory does not exist.");
    process.exit(1);
  }

  let password = '';
  while (!password) {
    // Ask for password
    const promptResult = await prompt<{ password: string }>({
      type: "password",
      name: "password",
      message: "Enter your password:",
      validate: (input: string) => {
        if (1 > input.trim().length) {
          return "Password cannot be empty or whitespaces!";
        }
        return true;
      }
    });

    // Check command mode
    if (isEncrypt) {
      // Ask for confirm password
      const confirmResult = await prompt<{ password: string }>({
        type: "password",
        name: "password",
        message: "Confirm your password:",
        validate: (input) => {
          if (1 > input.trim().length) {
            return "Password cannot be empty or whitespaces!";
          }
          return true;
        }
      });
      if (promptResult.password === confirmResult.password) {
        // Password matched, use for encryption
        password = promptResult.password;
      } else {
        // Unmatched password, input again
        console.warn('Passwords are not matched, please try again.');
      }
    } else {
      // Use the password for decryption
      password = promptResult.password;
    }
  }

  // Check for input path type
  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) {
    console.log(`Directory ${isEncrypt ? "en" : "de"}cryption mode.`);
    await processDirectory(password, isEncrypt, inputPath, outputDir);
  } else {
    console.log(`Single file ${isEncrypt ? "en" : "de"}cryption mode.`);
    await processFile(password, isEncrypt, inputPath, outputDir);
  }
}

async function processDirectory(password: string, isEncrypt: boolean, inputDir: string, outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const dirItems = fs.readdirSync(inputDir);
  for (const itemName of dirItems) {
    // Check directory item
    const inputPath = path.join(inputDir, itemName);
    const stat = fs.statSync(inputPath);

    // Prepare output path
    let outputPath: string, isDirectory = false;
    if (stat.isDirectory()) {
      outputPath = path.join(outputDir, itemName);
      isDirectory = true;
    } else if (isEncrypt) {
      outputPath = path.join(outputDir, itemName + ".enc"); // Append .enc for encrypted files
    } else {
      outputPath = path.join(outputDir, itemName.replace(/\.enc$/, "")); // Remove .enc for decrypted files
    }

    // Check item type
    if (isDirectory) {
      await processDirectory(password, isEncrypt, inputPath, outputPath); // Recursive call
    } else {
      await processFile(password, isEncrypt, inputPath, outputDir);
    }
  }
}

async function processFile(password: string, isEncrypt: boolean, inputPath: string, outputDir: string) {
  const fileName = path.basename(inputPath);
  const outputFileName = isEncrypt ? fileName + ".enc" : fileName.replace(/\.enc$/, "");
  const outputPath = path.join(outputDir, outputFileName);

  const data = fs.readFileSync(inputPath);
  const processedData = isEncrypt ? await WCipher.encrypt(password, data) : await WCipher.decrypt(password, data);
  fs.writeFileSync(outputPath, processedData);
  console.log(`${isEncrypt ? "En" : "De"}crypted: ${inputPath} -> ${outputPath}`);
}

main().catch(console.error);
