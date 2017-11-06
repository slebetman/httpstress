#! /usr/bin/env node

var request = require('request');

var target = 'https://odintoken.io';
var clients = 200;

var test_clients = [];
var latencies = [];

var success = 0;
var failures = 0;

function TestClient (url) {
	this.running = true;
	
	this.run(url);
}

TestClient.prototype = {
	run: function (url) {
		var self = this;
		var start = Date.now();
		
		request({
			url: url,
			agentOptions: {
				keepAlive: true
			}
		},function(err,res,body){
			if (err) {
				failures++;
			}
			else {
				success++;
			}
			var end = Date.now();
			latencies.push(end-start);
			
			if (self.running) {
				self.run(url);
			}
		});
	},
	stop: function () {
		this.running = false;	
	}
}

// var spinner = '/-\|';
// var spinner = '.oOo';
// var spinner = '.oO0Oo';
// var spinner = '←↖↑↗→↘↓↙';
var spinner = '◐◓◑◒';
var start = Date.now();
var status = ' ...';
var n = 0;
var killer = 0;

function displayStats () {
	n = (n+1) % spinner.length;
	killer = (killer+1) % 50;
	
	if (n == 0) {
		var now = Date.now();
		var total = success+failures;
		
		status = ' Requests per second: ' + Math.round(total / ((now - start)/1000)) + ', total: ' + total;
		
		if (failures > 0) {
			status += ' (' + failures + ' failures)';
		}
		
		if (latencies.length > 0) {
			var averageLatency = latencies.reduce((a,x)=>a+x)/latencies.length;
			var maxLatency = latencies.reduce((a,x)=>a>x?a:x);
			latencies.splice(0,latencies.length-clients);
			
			status += ', latency: avg=' + averageLatency.toFixed(0) + 'ms' +
				' max=' + maxLatency + 'ms';
		}
	}
	
	if (killer == 0) {
		test_clients.shift().stop();
		test_clients.push(new TestClient(target));
		status += ' ##';
	} 
	
	process.stdout.write('\r ' + spinner[n] + status + '     ');
}

for (var i=0; i<clients; i++) {
	test_clients.push(new TestClient(target));
}

setInterval(displayStats, 100);

