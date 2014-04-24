/**
 * Author: chenboxiang
 * Date: 14-4-24
 * Time: 下午12:48
 */
'use strict';

var koa = require('koa');
var request = require('supertest');
var http = require('http');
var router = require('koa-router');
var namespace = require('../index');

var pending = function(n, fn){
    return function(err){
        if (err) return fn(err);
        --n || fn();
    }
};

describe('app.namespace(path, fn)', function() {
    it('should not prefix root-level paths', function(done){
        var app = new koa();
        app.use(router(app));
        namespace(app);

        done = pending(4, done);

        app.get('/one', function *(){
            this.body = 'GET one';
        });

        app.get('/some/two', function *(){
            this.body = 'GET two';
        });

        app.get(['/three', '/four'], function *() {
            this.body = 'GET three or four';
        })

        var server = http.createServer(app.callback());
        request(server)
            .get('/one')
            .expect('GET one', done);

        request(server)
            .get('/some/two')
            .expect('GET two', done);

        request(server)
            .get('/three')
            .expect('GET three or four', done);

        request(server)
            .get('/four')
            .expect('GET three or four', done);
    })

    it('should prefix within .namespace()', function(done) {
        var app = new koa();
        app.use(router(app));
        namespace(app);

        done = pending(7, done);

        app.get('/one', function *(){
            this.body = 'GET one';
        });

        app.namespace('/foo', function(){
            app.get(function *(){
                this.body = 'foo';
            });

            app.namespace('/baz', function(){
                app.get(['/', '/alias'], function *(){
                    this.body = 'GET baz';
                });

                app.del('/all', function *() {
                    this.body = 'DELETE all baz';
                });
            })

            app.get('/bar', function *() {
                this.body = 'bar';
            });
        })

        app.get('/some/two', function *(){
            this.body = 'GET two';
        });

        var server = http.createServer(app.callback());

        request(server)
            .get('/one')
            .expect('GET one', done);

        request(server)
            .get('/some/two')
            .expect('GET two', done);

        request(server)
            .get('/foo')
            .expect('foo', done);

        request(server)
            .get('/foo/baz')
            .expect('GET baz', done);

        request(server)
            .get('/foo/baz/alias')
            .expect('GET baz', done);

        request(server)
            .del('/foo/baz/all')
            .expect('DELETE all baz', done);

        request(server)
            .get('/foo/bar')
            .expect('bar', done);
    })
})