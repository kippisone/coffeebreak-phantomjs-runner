var path = require('path'),
    spawn = require('child_process').spawn;

/**
 * Runs browser tests using PhantomJS
 */
module.exports = function(coffeeBreak) {
	"use strict";

	coffeeBreak.registerTask('test', function(project, session, done) {

        //Skip runner on node tests
        if (project.environment !== 'browser') {
            coffeeBreak.debug('Skipping node tests in PhantomJS runner');
            done();
            return;
        }

        process.stdout.write('\n  \u001b[1;4;38;5;246mRun browser tests of project ' + project.project + ' using PhantomJS\u001b[m\n\n');

        var command = path.join(__dirname, '/node_modules/.bin/mocha-phantomjs');
        var args = [
            'http://localhost:' + coffeeBreak.port + '/projects/' + project.project + '/SpecRunner.html'
        ];

        var child = spawn(command, args);
        child.stdout.on('data', function (data) {
            process.stdout.write(data);
        });

        child.stderr.on('data', function (data) {
            log.error(data);
        });

        child.on('close', function (code) {
            done(null);
        });

        session.once('end', function() {
            child.kill('SIGHUP');
        });
	});
};