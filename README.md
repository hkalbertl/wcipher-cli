# wcipher-cli

A simple command-line tool for encrypting and decrypting files using [wcipher](https://github.com/hkalbertl/wcipher).

## Installation
You can install wcipher-cli globally using npm, yarn, or pnpm:
```sh
# Using npm
npm install -g wcipher-cli

# Using yarn
yarn global add wcipher-cli

# Using pnpm
pnpm add -g wcipher-cli
```

# Usage
The `wcipher` command follows this syntax:

```sh
wcipher <encrypt|decrypt> <input-file> <output-file>
```

## Encrypt a file
```sh
wcipher encrypt input.jpg output.enc
```
This will encrypt input.jpg and save it as output.enc. You will be prompted to enter a password.

## Decrypt a file
```sh
wcipher decrypt output.enc decrypted.jpg
```
This will decrypt output.enc back to decrypted.jpg. You must enter the same password used for encryption.

# Requirements
* Node.js 16 or later
* wcipher (automatically installed as a dependency)

## License
Licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) license.
