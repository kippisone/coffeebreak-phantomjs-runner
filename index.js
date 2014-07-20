var path = require('path'),
    spawn = require('child_process').spawn;

/**
 * Runs browser tests using PhantomJS
 */
module.exports = function(coffeeBreak) {
	"use strict";

	coffeeBreak.registerTask('test', function(conf, logger, done) {

        //Skip runner on node tests
        if (!conf.browser) {
            console.log('Skip tests with phantomjs');
            done();
            return;
        }

        process.stdout.write('\n  \u001b[1;4;38;5;246mRun browser tests of project ' + conf.project + ' using PhantomJS\u001b[m\n\n');

        var command = path.join(__dirname, '/node_modules/.bin/mocha-phantomjs');
        var args = [
            'http://localhost:3005/projects/' + conf.project + '/SpecRunner.html'
        ];

        var child = spawn(command, args);
        child.stdout.on('data', function (data) {
            process.stdout.write(data);
        });

        child.stderr.on('data', function (data) {
            log.error(data);
        });

        child.on('close', function (code) {
            var statusCode = code === 0 ? true : false;
            done(null, statusCode);
        });		
	});
};