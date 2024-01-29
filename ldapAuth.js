const http = require('http');
const querystring = require('querystring');
const ldap = require('ldapjs');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/ldap_auth') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      const { email, password } = querystring.parse(body);

      const client = ldap.createClient({
        url: 'ldap://127.0.0.1:1389', // Update with your LDAP server details
      });

      const dn = `uid=${email},ou=users,dc=mycompany,dc=com`; // Update with your LDAP structure
      client.bind(dn, password, (err) => {
        res.setHeader('Content-Type', 'text/plain');

        if (err) {
          console.error(err);
          res.statusCode = 401;
          res.end('Invalid credentials');
        } else {
          console.log('LDAP authentication successful');
          res.statusCode = 200;
          res.end('LDAP authentication successful');
        }
      });
    });
  } else {
    // Handle other routes or static files
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
