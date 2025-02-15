const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const websitePath = path.join(__dirname, 'Website');
console.log('Website directory path:', websitePath);

// List all files in Website directory for debugging
console.log('Website directory contents:', fs.readdirSync(websitePath));

// Serve static files from the Website directory
app.use(express.static(websitePath));

// Handle all routes
app.get('*', (req, res) => {
    let filePath;
    
    // If root path or /index.html, serve index.html
    if (req.path === '/' || req.path === '/index.html') {
        filePath = path.join(websitePath, 'index.html');
    } else {
        // For other paths, try to serve the requested file
        const requestedPath = req.path.substring(1); // Remove leading slash
        filePath = path.join(websitePath, requestedPath);
        
        // If file doesn't exist and doesn't end with .html, try adding .html
        if (!fs.existsSync(filePath) && !requestedPath.endsWith('.html')) {
            filePath = path.join(websitePath, `${requestedPath}.html`);
        }
    }

    // Check if file exists and serve it
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        console.error('File not found:', filePath);
        // If file not found, serve index.html for client-side routing
        res.sendFile(path.join(websitePath, 'index.html'));
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Debug directory contents
    console.log('\nRoot directory contents:');
    fs.readdirSync(__dirname).forEach(file => {
        console.log(` - ${file}`);
    });
    
    console.log('\nWebsite directory contents:');
    fs.readdirSync(websitePath).forEach(file => {
        console.log(` - ${file}`);
    });
}); 