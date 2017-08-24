# Cheap Movie

This is a sample web app designs to allow visitors get cheapest movie ticket's price from two providers in a timely manner.

[Live demo](https://movies-fetcher.herokuapp.com)

## Observation

1) All resources (images, movieId) are valid
2) Mocked API delays/fails a request on purpose
3) Delayed request is likely to serve faster upon retry
4) MovieId stored in both providers, apart from prefix are the same ID

## Decision

Based-on the observation above. I decided to deal with the backend as follow:

* Using config.timeout (default: 1000ms) to force the backend to comply. If it doesn't I will drop my connection :grinning:
* Using config.backoff (default: 1000ms) is used to retry the request
* Using config.retry (default: 1) to retry a failed request
* 404 response will not retry
* If after all we still can get the data back then defaultValue will be return - so I can reduce a couple if/else blocks here and there.

## Solutions

* Fetching movies from both providers and normalize the movie Id by removing prefix
* Merge movies into a single collection base on newly normalized ids
* Sening the movies collection back to client as soon as merged completed
* Once client received movies list, it will extract movies's id and sending back to server for detail info via socket.io
* Server received request via socket.io started to fetch movie details and sending each one back to client

## Not Implemented

* Client & Server cache - small resources & refreshness info was not told
* Others overthinking features, because who care? customer wanted to have a reliable system that can tell them what is the cheapest movie ticket price and where.

After all, it's a great fun to play with the cheecky API :smiling_imp: :sparkles: unless someone wanted to put the blame on Micro$oft IIS :laughing:

## Tests
![Get know a new friend](https://raw.githubusercontent.com/csokun/movies-fetcher/master/what-a-cheeky-backend.png)

## Development 

Copy `config.sample.json` to `config.dev.json` and update the details configuration.

## Deployment

In production add a new ENV variable `app_config` and copy/paste entire (valid) config.

Have fun!