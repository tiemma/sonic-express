# sonic < express >

![image](https://raw.githubusercontent.com/Tiemma/sonic-core/master/image.png) 

Accelerate your swagger doc experience on Express.

# What does this do?
This hooks into the Express `res` and `req` API and auto-documents each response for you so you never have to.

Imagine writing 100 APIs and having it entirely documented, that's what this helps you with.

# How to use it

- Import the middleware
- Pass in the options
- Sit back and call your APIs

## Import the middleware
The middleware for this project is currently exposed for only Express.
```javascript
import { getResponseExpress } from '@tiemma/sonic-express';
```

## Pass in the options
The express middleware requires three parameters
 - Top-level app instance
 - Swagger options (you can use the example [here](./examples/swagger-config.js) if you need one)
 - Path to where the generated swagger file should be saved
```javascript
import { getResponseExpress } from '@tiemma/sonic-express';
import options from './swagger-config';

app.use(getResponseExpress(app, options, './examples/swagger.json'));
```

If you're considering adding this for other JS web frameworks, have a look at the core API [here](https://github.com/Tiemma/sonic-core) and see how to extract the required parameters for that framework.

## Sit back and call your APIs
Once the middleware is initiated, all API calls that match the domains within `servers[*].url` in the swagger specification will be logged.
For example, the `servers` block in the options stated [here](./examples/swagger-config.js) has an url entry for `/api/v1`.
So all URLs containing `/api/v1` will be logged, `/api/v2` entries will not.

To enable for other URL prefixes, add the entry to the `servers` block and they will be automatically logged.

# Why did I do this?
I work at [Replex](https://replex.io) (shameless plug here) and I got tired of tickets to update the swagger documentation which isn't easy or also extremely fun to do.

So whilst creating a simple handler to record the requests, I started this project.

# What can I do with this?
You can use it to avoid writing a majority of the swagger specification or none at all for your express projects.

# What specifications is this project written in?
Currently, the core API section starting [here](https://github.com/Tiemma/sonic-core/blob/master/src/swagger-utils.js#L318) handles swagger 2 and 3 configurations quite fine.

Doubt it!?, test the swagger file [here](./examples/swagger.json) on [editor.swagger.io](editor.swagger.io).
The spec listed above was generated using this same tool from tests [here](./test).

# Best Practices 
1. Ensure you enable the middleware during tests
- Unless you prefer overwriting parameters during development, it's best to keep the middleware working on a testing configuration so you don't mistakenly generate docs in production and slow down your API :-).
The handler keeps the swaggerDoc in memory and writes updates per request.
```javascript
if(process.env.NODE_ENV === 'testing') {
    app.use(getResponseExpress(app, options, './examples/swagger.json'));
}
```

2. You can still add docs for your APIs
The middleware will adequately handle generating the swagger docs for undocumented routes.
By undocumented routes, I mean routes without these fancy JSDoc comments
```javascript
/**
 * @swagger
 * ...inserts more docs, arrrghhhh
 */
```

Despite the ease of this, be sure to add descriptions where needed for your end users.
```javascript
/**
 * @swagger
 * /mouse/{id}/man:
 *   post:
 *     name: mouse
 *     summary: Create mouse
 *     description: Creates a mouse under a man's house, rhymes with the times dudes
 */
```

3. That's about it from me, the rest is with you, me, the Issues page on this repo and Stackoverflow.

# Debugging
Logs from the core API can be exposed by setting the `DEBUG` environment variable.
```bash
export DEBUG="@tiemma/sonic-core"
```

# I found a bug, how can I contribute?
Open up a PR using the ISSUE TEMPLATE [here](./.github/ISSUE_TEMPLATE/feature_request.md)