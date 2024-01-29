const ldap = require('ldapjs');

// Create an LDAP server
const server = ldap.createServer();

// Define a simple in-memory directory
const users = {
  uid: {
    dn: 'uid=user,ou=users,dc=mycompany,dc=com',
    attributes: {
      objectclass: ['top', 'person', 'uidObject'],
      uid: 'user',
      userPassword: 'password',
    },
  },
};

// Bind event to handle user authentication
server.bind('ou=users,dc=mycompany,dc=com', (req, res, next) => {
  const dn = req.dn.toString();
  const user = users[dn];

  if (!user) {
    return next(new ldap.NoSuchObjectError(dn));
  }

  if (user.attributes.userPassword !== req.credentials) {
    return next(new ldap.InvalidCredentialsError());
  }

  res.end();
  return next();
});

// Start the LDAP server
server.listen(1389, () => {
  console.log('LDAP server listening at ldap://127.0.0.1:1389');
});
