# wcipher-cli

A simple command-line tool for encrypting and decrypting files using [wcipher](https://github.com/hkalbertl/wcipher) with an user defined password.

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
wcipher [encrypt|decrypt] [input file or directory] [output directory]
```

## Encrypt a file
```sh
wcipher encrypt /data/photo/profile.jpg /data/encrypted
```
This will encrypt `/data/photo/profile.jpg` and save it as `/data/encrypted/profile.jpg.enc`. You will be prompted to enter a password.

## Decrypt a file
```sh
wcipher decrypt /data/encrypted/profile.jpg.enc /data/decrypted
```
This will decrypt `/data/encrypted/profile.jpg.enc` back to `/data/decrypted/profile.jpg`. You must enter the same password used for encryption.

## Encrypt contents of a directory
```sh
wcipher encrypt /data/photo /data/encrypted
```
This will encrypt `/data/photo` with its contents and save encrypted contents under `/data/encrypted` recursively. Extension name `.enc` will be added to all files. Directory name remain unchanged. You will be prompted to enter a password.

## Decrypt contents of a directory
```sh
wcipher decrypt /data/encrypted /data/decrypted
```
This will decrypt `/data/encrypted` with its contents and save decrypted contents under `/data/decrypted` recursively. Extension name `.enc` will be removed from all files. Directory name remain unchanged. You must enter the same password used for encryption.

# Requirements
* Node.js 16 or later
* wcipher (automatically installed as a dependency)

## License
Licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php) license.
