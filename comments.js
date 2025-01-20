// Create web server
// Handle requests and responses
// Read and write comments to the file system

// 1. Import modules
const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

// 2. Create a web server
const app = http.createServer((req, res) => {
  // 3.1. Parse the request URL
  const parsedUrl = url.parse(req.url, true);
  // 3.2. Extract the pathname and query string
  const { pathname, query } = parsedUrl;
  // 3.3. Extract the HTTP method
  const method = req.method;

  // 4. Handle the request
  if (pathname === '/') {
    // 4.1. Read the form.html file
    fs.readFile('form.html', 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not found');
        return;
      }
      res.statusCode = 200;
      res.end(data);
    });
  } else if (pathname === '/comments') {
    if (method === 'POST') {
      // 4.2. Read the form data
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        const { name, comment } = qs.parse(body);
        // 4.3. Read the comments.json file
        fs.readFile('comments.json', 'utf8', (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end('Internal server error');
            return;
          }
          const comments = JSON.parse(data);
          // 4.4. Add a new comment
          comments.push({ name, comment });
          // 4.5. Write the comments to the comments.json file
          fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
            if (err) {
              res.statusCode = 500;
              res.end('Internal server error');
              return;
            }
            res.statusCode = 303;
            res.setHeader('Location', '/comments');
            res.end();
          });
        });
      });
    } else {
      // 4.6. Read the comments.json file
      fs.readFile('comments.json', 'utf