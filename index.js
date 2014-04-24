/**
 * Author: chenboxiang
 * Date: 14-4-23
 * Time: 下午5:32
 */
'use strict';

var methods = require('methods');
var slice = Array.prototype.slice;

module.exports = function(app) {
    // must have used koa-router middleware
    if (!app.all) {
        throw new Error('You must use koa-router middleware first.')
    }

    ['all', 'del'].concat(methods).forEach(function(method) {
        var originalFn = app[method];
        app[method] = function() {
            var args = slice.call(arguments);

            if (this._namespaces && this._namespaces.length > 0) {
                var path;
                var pathIndex = null;

                // not pass the name and path parameter
                if (typeof arguments[0] === 'function') {
                    path = '/';
                }
                else {
                    // not pass the name parameter
                    if (typeof arguments[1] === 'function') {
                        pathIndex = 0;
                    }
                    // pass the name parameter
                    else {
                        pathIndex = 1;
                    }
                    path = arguments[pathIndex];
                }

                var path = Array.isArray(path) ? path : [path];

                path = path.map(function(p) {
                    app.namespace(p, function() {
                        p = this._namespaces.join('/').replace(/\/\/\/?/g, '/').replace(/\/$/, '') || '/';
                    })
                    return p;
                })

                if (path.length === 1) path = path[0];

                if (pathIndex == null) {
                    // add path to the first parameter
                    args.unshift(path);
                }
                else {
                    // replace origin path
                    args.splice(pathIndex, 1, path);
                }
            }

            return originalFn.apply(this, args);
        }
    })

    app.namespace = function(path, fn) {
        if (!(path && typeof path === 'string')) {
            throw new Error('Invalid path. it must be a string and not empty.');
        }
        (this._namespaces = this._namespaces || []).push(path);
        fn.call(this);
        this._namespaces.pop();

        return this;
    }
}