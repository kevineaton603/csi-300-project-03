const electron = require('electron')
const $ = require('jquery')
const ipc = electron.ipcRenderer
const remote = electron.remote
const mysql = require('mysql')
const fs = require('fs')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'twitter'
})
let win = electron.remote.getCurrentWindow()

$(document).ready(()=>{
    connection.connect()
    $('#sign-up').submit((event)=>{
        var newUser = $( '#sign-up' ).serializeArray();
        newUserValue =  new Array()
        event.preventDefault()
        newUser.forEach(element => {
            newUserValue.push(element['value'])
        });
        console.log(newUserValue);
        
        sign_up_validate(newUserValue).then((results)=>{
            console.log(results);
            if(!results)
            {
                console.log(results);
                ipc.send('new-user', newUserValue);
                create_user(newUserValue);
                var window = remote.getCurrentWindow();
                window.close();
            }
            else
            {
                console.log('user exists');
            }
        })
        
    })
    $('#login').submit((event)=>{
        var login = $( '#login' ).serializeArray();
        var login_value = new Array();
        event.preventDefault()
        console.log(login);
        login.forEach(element => {
            login_value.push(element['value'])
        });
        validate(login_value).then((results)=>{
            console.log(results)
            if(results)
            {
                console.log("valid");
                ipc.send('login-cred', login);
                var window = remote.getCurrentWindow();
                window.close();
            }
            else{
                console.log("invalid");
                //Tell user there is an error
            }
        })
        
    })
})

async function validate(login_cred = [])
{
    try
    {
        const login_val_sql = await get_query('sql/login.sql')
        const login_validate = await query(login_val_sql, login_cred)
        return login_validate.length
    }
    catch(err)
    {
        console.error(err);
        return false;
    }
    return false;
}

async function sign_up_validate(new_user = [])
{
    try
    {
        console.log(new_user[1])
        const existing_user_sql = await get_query('sql/existing_user.sql')
        const existing_user = await query(existing_user_sql, [new_user[1]]);
        return existing_user.length;
    }
    catch(err)
    {
        console.error(err);
        return false;
    }
    return false;
}
async function create_user(user_info)
{
    try
    {
        const create_user_sql = await get_query('sql/create_user.sql')
        const create_user = await query(create_user_sql, user_info);
    }
    catch(err)
    {
        console.error(err);
        return false;
    }
    return false;
}

function get_query(filename)
{
    return new Promise((resolve, reject)=>{
        fs.readFile(filename, (err, data)=>{
            if(err) {reject(err)};
            console.log(data.toString());
            if(data)
            {
                data = data.toString()
                resolve(data)
            }
            else{
                reject(0)
            }
        })
    })
}
function query(sql, values=[])
{
    return new Promise((resolve, reject)=>{
        connection.query({
            sql: sql,
            values: values
            }, 
            function (error, results, fields) {
            if (error){ reject(error); }
            console.log(results)
            resolve(results);
        });
    })
}

win.on('close', ()=>{
    connection.end();
})