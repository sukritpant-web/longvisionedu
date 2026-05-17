const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8089;
const JSON_FILE_PATH = path.join(__dirname, 'emails.json');

// Helper to send JSON responses
function sendJSON(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// Ensure the local emails.json file exists and is valid
function initJSONDatabase() {
    if (!fs.existsSync(JSON_FILE_PATH)) {
        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([], null, 2), 'utf8');
        console.log('Database initialized: Created empty emails.json file.');
    } else {
        try {
            const fileData = fs.readFileSync(JSON_FILE_PATH, 'utf8');
            JSON.parse(fileData); // Verify valid JSON
        } catch (e) {
            console.warn('Warning: emails.json was corrupted. Re-initializing database.');
            fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([], null, 2), 'utf8');
        }
    }
}

initJSONDatabase();

const server = http.createServer((req, res) => {
    // 1. API Route: Notify Me Form Submission (POST)
    if (req.url === '/api/notify' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                const email = parsedBody.email ? parsedBody.email.trim() : null;

                // Basic validation
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    return sendJSON(res, 400, { success: false, error: 'Please enter a valid email address.' });
                }

                // Read current local JSON database
                let emails = [];
                if (fs.existsSync(JSON_FILE_PATH)) {
                    try {
                        const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf8');
                        emails = JSON.parse(fileContent);
                    } catch (readError) {
                        emails = [];
                    }
                }

                // Check for duplicates
                const isDuplicate = emails.some(item => item.email.toLowerCase() === email.toLowerCase());
                if (isDuplicate) {
                    return sendJSON(res, 409, { success: true, message: 'You have already subscribed!' });
                }

                // Append new subscription
                const newSubscription = {
                    email: email,
                    timestamp: new Date().toISOString()
                };
                emails.push(newSubscription);

                // Write back to emails.json
                fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(emails, null, 2), 'utf8');
                console.log(`Subscribed: ${email} (Logged to emails.json)`);

                return sendJSON(res, 200, { success: true, message: 'Awesome! We will notify you on launch day.' });

            } catch (err) {
                console.error('Error handling API request:', err);
                return sendJSON(res, 500, { success: false, error: 'Internal server error occurred.' });
            }
        });
        return;
    }

    // 2. Static File Server (GET)
    if (req.method === 'GET') {
        // Resolve URL path
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(__dirname, filePath);

        // Security check: ensure path does not escape the project directory
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            return res.end('Access Denied');
        }

        // Get extension
        const ext = path.extname(filePath).toLowerCase();

        // Mime types mapping
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // Try index.html or return 404
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 Not Found</h1><p>The requested file could not be found.</p>');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
        return;
    }

    // Default Fallback
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
});

server.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  Longvision Landing Page Server running locally!`);
    console.log(`  URL: http://localhost:${PORT}/`);
    console.log(`  Logging to: ${JSON_FILE_PATH}`);
    console.log(`==================================================`);
});
