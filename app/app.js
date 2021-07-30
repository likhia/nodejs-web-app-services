/*
 * Copyright (c) 2012-2019 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

/*eslint-env node*/

var express = require('express');
var app = express();

var banner = "<img src=\"https://images.unsplash.com/photo-1445205170230-053b83016050?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80\" width=\"900\" height=\"200\"><br>";

var color = process.env.COLOR || 'lightgrey';
   
var css = "<head><style>";
css = css + "body {background-color: " + color  + ";}"
css = css+ "label   {color: black; font:arial}";
css = css + "</style></head><br>";

let responseContent = '';

var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/', function (req, res) {
   var endpoint = process.env.ENDPOINT || 'https://routevpl6rir8-opentlc-mgr-codeready.apps.cluster-2e68.2e68.sandbox1783.opentlc.com/'
   var script = "<script>";
   script = script + "</script>";


   //var banner = "<img src=\"https://images.unsplash.com/photo-1445205170230-053b83016050?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80\" width=\"900\" height=\"200\"><br>";
   var content = "<html>" + css + script + banner;

   var model = "<select id=\"model\" name=\"model\">";
   model = model + "<option value=\"Vios\">Toyota Vios</option>";
   model = model + "<option value=\"Wish\">Toyota Wish</option>";
   model = model + "<option value=\"Mazda3\">Mazda 3</option>";
   model = model + "<option value=\"Fit\">Honda Fit</option>";
   model = model + "<option value=\"City\">Honda City</option>";
   model = model + "</select>";

   var color = "<select id=\"color\" name=\"color\">";
   color = color + "<option value=\"BLACK\">BLACK</option>";
   color = color + "<option value=\"WHITE\">WHITE</option>";
   color = color + "<option value=\"BLUE\">BLUE</option>";
   color = color + "<option value=\"GREY\">GREY</option>";
   color = color + "<option value=\"RED\">RED</option>";
   color = color + "</select>";

   var engine = "<select id=\"engine\" name=\"engine\">";
   engine = engine + "<option value=\"1.2\">1.2</option>";
   engine = engine + "<option value=\"1.5\">1.5</option>";
   engine = engine + "<option value=\"1.6\">1.6</option>";
   engine = engine + "<option value=\"2.0\">2.0</option>";
   engine = engine + "</select>";

   var createdYr = "<select id=\"createdyr\" name=\"createdyr\">";
   createdYr = createdYr + "<option value=\"2021\">2021</option>";
   createdYr = createdYr + "<option value=\"2020\">2020</option>";
   createdYr = createdYr + "<option value=\"2019\">2019</option>";
   createdYr = createdYr + "</select>";

   var type = "<select id=\"type\" name=\"type\">";
   type = type + "<option value=\"NORMAL\">Normal</option>";
   type = type + "<option value=\"WEEKEND\">Weekend</option>";
   type = type + "</select>";

   content = content + "<body><p>";
   content = content + "<form action = \"" + endpoint + "process_post\" method = \"POST\">";
   content = content + "<table width=\"20%\">"
   content = content + "<tr><td><label for=\"lfn\">Model </label> : </td> <td>" + model +  "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Color </label>: </td> <td>" + color + "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Engine Capacity </label>: </td> <td>" + engine + "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Created Year </label>: </td> <td>" + createdYr + "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Type </label>: </td> <td>" + type + "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Used Vehicle </label>: </td> <td><input type = \"checkbox\" id =\"used\" name = \"used\"></td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">User </label>: </td> <td><input type = \"text\" id = \"user\" name = \"user\"></td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td colspan=\"2\"><input type = \"submit\" name=\"submit\" value = \"Submit\"></td></tr>";
   content = content + "</form>"
   content = content + "</body></html>";

   res.send(content);

   //res.sendFile( __dirname + "/" + "inputForm.html" );
})

app.post('/process_post', urlencodedParser, function (req, res) {

   createOrder(req,res);   
})

function getResponseContent(reply) {
    var content = "<html>" + css + banner;
    content = content + "<body><p/>"; 
    content = content + "<label name=\"msg\">" + reply + "</label>"  ; 
    content = content + "</body></html>"

    return content;
}

function setVal(carplate, res) {
    responseContent = carplate + " is the assigned car plate number.";
    res.end(getResponseContent(responseContent));
}

function createOrder(req, res) {
    const http = require('http')

    
    var hostname = process.env.HOSTNAME || 'workshop-main.service.svc.cluster.local'
    var port = process.env.PORT || '8080'

    var used = "true";
    if (req.body.used == null) {
        used = "false";
    }

    const data = JSON.stringify({
        'model' : req.body.model,
        'color' : req.body.color,
        'type' : req.body.type,
        'engineCapacity' : req.body.engine,
        'createdYear': req.body.createdyr,
        'user' : req.body.user,
        'used' : used
    })

    console.log(`data : ${data}`)
    
    const options = {
        hostname: hostname,
        port: port,
        path: '/api/service/registervehicle',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

        
    
    const req2 = http.request(options, res2 => {
        console.log(`statusCode: ${res2.statusCode}`)

        if (res2.statusCode != 200) {
            res.end(getResponseContent("The request has failed.  Please try again."));
        }

        res2.on('data', d => {
            process.stdout.write(d)

            if (res2.statusCode == 200) {
                //var result = JSON.parse(d)
                
                //setVal(result,res);
                setVal(d,res);
            } else {
                res.end(getResponseContent("The request has failed.  Please try again."));
            }
               
        })

    })

    req2.on('error', error => {
        console.error(error)
    })

    
    req2.write(data)
    req2.end()

}



app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
