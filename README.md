# csi-300-project-03

A twitter clone for CSI-300-01

**Requires NodeJS**

## Dependencies

* Electron  
    `npm install electron`
* MySQL  
    `npm install mysql`
* jQuery  
    `npm install jquery`

## Running

* `npm start`

If you have a root password for mysql you must modify: `js/common.js` and `js/login.js`

```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '[INSERT PASSWORD]',
    database: 'twitter'
});
```