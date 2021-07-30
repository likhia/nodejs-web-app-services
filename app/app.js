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

var color = process.env.COLOR || 'black';
   
var css = "<head><style>";
css = css + "body {background-color: lightgray;}"
css = css+ "label   {color: " + color + "; font:arial}";
css = css + "</style></head><br>";

let responseContent = '';

var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/', function (req, res) {
   var endpoint = process.env.ENDPOINT || 'https://routelyh124fx-opentlc-mgr-codeready.apps.cluster-1ec0.1ec0.sandbox1350.opentlc.com/'

   var script = "<script>";
   script = script + "function getTotalPrice() {";
   script = script + "   var qty = document.getElementById(\"qty\");";
   script = script + "   selectedQty = qty.options[qty.selectedIndex].value;";
   script = script + "   var product = document.getElementById(\"product\");";
   script = script + "   selectedProduct = product.options[product.selectedIndex].value;";
   script = script + "   if (selectedProduct.startsWith(\"D\")) {";
   script = script + "        document.getElementById(\"totalprice\").value = selectedQty * 30.00;";
   script = script + "        document.getElementById(\"unitprice\").value = 30.00;";
   script = script + "    } else { ";
   script = script + "        document.getElementById(\"totalprice\").value = selectedQty * 10.00;";
   script = script + "        document.getElementById(\"unitprice\").value = 10.00;";
   script = script + "    } ";
   script = script + "}";
   script = script + "function validate() {";
   script = script + "   if (document.getElementById(\"totalprice\").value == 0) { "
   script = script + "      alert(\"Quantity must be > 0.\");";
   script = script + "      return false;";
   script = script + "   }";
   script = script + "   return true;";
   script = script + "}";
   script = script + "</script>";


   //var banner = "<img src=\"https://images.unsplash.com/photo-1445205170230-053b83016050?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80\" width=\"900\" height=\"200\"><br>";
   var content = "<html>" + css + script + banner;

   var product = "<select id=\"product\" name=\"product\" onchange=\"getTotalPrice()\">";
   product = product + "<option value=\"\">Please select</option>";
   product = product + "<option value=\"D001\">D001 - Office Dress 1</option>";
   product = product + "<option value=\"D002\">D002 - Office Dress 2</option>";
   product = product + "<option value=\"D003\">D003 - Office Dress 3</option>";
   product = product + "<option value=\"T001\">T001 - White Top 1</option>";
   product = product + "<option value=\"T101\">T101 - Blue Top 1</option>";
   product = product + "<option value=\"T201\">T201 - Black Top 1</option>";
   product = product + "</select>";

   var qty = "<select id=\"qty\" name=\"qty\" onchange=\"getTotalPrice()\">";
   qty = qty + "<option value=\"0\">0</option>";
   qty = qty + "<option value=\"1\">1</option>";
   qty = qty + "<option value=\"2\">2</option>";
   qty = qty + "<option value=\"3\">3</option>";
   qty = qty + "</select>";

   content = content + "<body><p>";
   content = content + "<form action = \"" + endpoint + "process_post\" method = \"POST\">";
   content = content + "<table width=\"20%\">"
   content = content + "<tr><td><label for=\"lfn\">Product </label> : </td> <td>" + product +  "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Quantity </label>: </td> <td>" + qty + "</td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Price </label>: </td> <td><input type = \"text\" id = \"unitprice\" name = \"unitprice\" readonly></td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td><label for=\"lln\">Total Price </label>: </td> <td><input type = \"text\" id = \"totalprice\" name = \"price\" readonly></td></tr>";
   content = content + "<tr><td colspan=\"2\"></td></tr>";
   content = content + "<tr><td colspan=\"2\"><input type = \"submit\" name=\"submit\" value = \"Order Now\" onclick=\"return validate()\"></td></tr>";
   content = content + "</form>"
   content = content + "</body></html>";

   res.send(content);

   //res.sendFile( __dirname + "/" + "inputForm.html" );
})

app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   response = {
      product:req.body.product,
      quantity: req.body.qty,
      price:req.body.price
   };

   createOrder(req,res);

   //res.end(JSON.stringify(response));
})

function getResponseContent(reply) {
    var content = "<html>" + css + banner;
    content = content + "<body><p/>"; 
    content = content + "<label name=\"msg\">" + reply + "</label>"  ; 
    content = content + "</body></html>"

    return content;
}

function setVal(orderId, res) {
    responseContent = "The order (" + orderId + ") is completed. Seller has proceed with the delivery.";
    res.end(getResponseContent(responseContent));
}

function createOrder(req, res) {
    const http = require('http')

    var hostname = process.env.HOSTNAME || 'acceptorder.orders.svc.cluster.local'
    var port = process.env.PORT || '8080'

    const data = JSON.stringify({
        'orderId' : '',
        'price' : req.body.price,
        'quantity': req.body.qty,
        'status' : ''
    })

    const options = {
        hostname: hostname,
        port: port,
        path: '/order/accept',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    }

        
    
    const req2 = http.request(options, res2 => {
        console.log(`statusCode: ${res2.statusCode}`)

        if (res2.statusCode != 200) {
            if(res2.statusCode == 504) {
                res.end(getResponseContent("The order has failed to proceed due to timeout.  Please try again."));
            } else {
                res.end(getResponseContent("The order has failed to proceed.  Please try again."));
            }
            
        }

        res2.on('data', d => {
            process.stdout.write(d)

            if (res2.statusCode == 200) {
                var result = JSON.parse(d)
                setVal(result.orderId,res);
            } else {
                res.end(getResponseContent("The order has failed to proceed.  Please try again."));
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
