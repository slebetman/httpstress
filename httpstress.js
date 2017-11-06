#! /usr/bin/env node

var request = require('request');
var zibar = require('zibar');

var target = 'https://odintoken.io';
//var target = 'http://localhost:3000';
var clients = 200;

var test_clients = [];
var latencies = [];
var request_per_second = [];

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
		var rps = Math.round(success / ((now - start)/1000));
		request_per_second.push(rps);
		
		status = ' Requests per second: ' + rps + ', total: ' + total;
		
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
	
	var col = process.stdout.columns;
	var orig = 0;
	var offset = 0;
	if ((request_per_second.length + 20) > col) {
		orig = request_per_second.length - col + 20;
		offset = 5 - (orig % 5);
	}
	var graph = zibar(request_per_second.slice(20-col),{
		color: 'green',
		xAxis: {
			origin: orig,
			offset: offset
		},
		min: 0
	});
	
	process.stdout.write('\033[H ' + spinner[n] + status + '      \n' + graph);
}

for (var i=0; i<clients; i++) {
	test_clients.push(new TestClient(target));
}

process.stdout.write('\033[2J');
setInterval(displayStats, 100);

