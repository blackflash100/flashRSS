#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];

const ASCII_ART = "  ______ _               _       _____   _____ _____ \n" +
    " |  ____| |             | |     |  __ \\ / ____/ ____|\n" +
    " | |__  | | __ _ ___  __| |__   | |__) | (___| (___  \n" +
    " |  __| | |/ _` / __|/ _` '_ \\  |  _  / \\___ \\\\___ \\ \n" +
    " | |    | | (_| \\__ \\ (_| | | | | | \\ \\ ____) |___) |\n" +
    " |_|    |_|\\__,_|___/\\__,_| |_| |_|  \\_\\_____/_____/ \n";

function isInstalled() {
    return fs.existsSync(path.join(__dirname, 'node_modules')) &&
        fs.existsSync(path.join(__dirname, 'client', 'dist'));
}

if (command === 'start') {
    console.log('\x1b[36m%s\x1b[0m', ASCII_ART);

    if (!isInstalled()) {
        console.log('� Some dependencies or build files are missing. Installing...');
        try {
            console.log('Running npm install...');
            execSync('npm install', { stdio: 'inherit', cwd: __dirname });
            console.log('Installing client dependencies...');
            execSync('npm install', { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
            console.log('Building frontend...');
            execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, 'client') });
            console.log('✅ Setup finished.');
        } catch (e) {
            console.error('❌ Automatic setup failed. Please run the installer script.');
            process.exit(1);
        }
    }

    console.log('�🚀 Starting FlashRSS...');
    const serverPath = path.join(__dirname, 'server.js');
    const server = spawn('node', [serverPath], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
    });

    server.on('close', (code) => {
        console.log(`FlashRSS process exited with code ${code}`);
    });
} else {
    console.log(ASCII_ART);
    console.log('Usage: flashRSS start');
}
