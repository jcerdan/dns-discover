/*
* Made for TECOB by Jordi Cerdan
*
* enter the domain name as a parameter
* usage: iojs dns-discover.js <domain_name>
*
*
*/

var dns = require('dns');
var fs = require('line-reader');
var lineReader = require('line-reader');

var rrdtypes = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'SOA'];
var domain = process.argv[2];

rrdtypes.forEach(function(value, index, rrdtypes){
	
	dns.resolve(domain, value, function(err, addresses){
	if(!err)
		//console.log("Error: " + err);
	//else
		console.log(domain + " " + value + " => " + JSON.stringify(addresses, null, 4));
	});
})

lineReader.eachLine('./dns-list.txt', function(line, last) {
  var subdomain = line+"."+domain;
	dns.resolve(subdomain, "CNAME", function(err, addresses){
		if(err){
			dns.resolve(subdomain, "A", function(err, addresses){
				if (!err)
					console.log(subdomain + " => " + JSON.stringify(addresses, null, 4))
			});
		}
		else
			console.log(subdomain + " => CNAME " + JSON.stringify(addresses, null, 4));
	});

  if (last) {
    return false;
  }
});
