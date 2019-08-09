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
- `-F, --fail <status list>` : Status numbers to consider as failure. Eg: '404,500'
- `-g, --graph` : draw graph when running
- `-h, --help` : print this help and exit
- `-H, --header <header>` : Define a header as 'Key: value' pair. Note that you can
    specify this option multiple times. Eg: 'Content-Type: application/json'
- `-p, --post <data>` : perform a POST request instead of a GET
- `-S, --success <status list>` : Status numbers to consider as successful response. All other
    response status will be considered failures if this option is specified. This overrides -F.

> Note: Since httpstress follows redirects, specifying status 3xx for the value of -F has no
> effect. Specifying 3xx for the value of -S will cause all responses to be treated as failures.

## Example:

    httpstress -g -c 100 \
      -H 'Cookie: session=12345' \
      -F '400,401,403,404,500' \
        http://example.com/test
	  

