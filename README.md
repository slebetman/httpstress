# httpstress
### Http stress testing / benchmarking tool

![screenshot](https://github.com/slebetman/httpstress/raw/master/screenshot.png)

## Installation

Just install with npm:

    npm install -g httpstress

## Usage

    httpstress [options] <url>
    
Options:

- `-c, --clients <number>` : number of clients to launch (default 100)
- `-g, --graph` : draw graph when running
- `-h, --help` : print this help and exit
- `-H, --header <header>` : define a header: 'Key: value'
- `-p, --post <data>` : perform a POST request instead of a GET

> Note: You can define -H/--header multiple times.

## Example

    httpstress -g -H 'Content-Type: application/json' -p '{"hello":"world"}' http://example.com/test

