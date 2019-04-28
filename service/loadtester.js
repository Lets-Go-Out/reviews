const loadtest = require('loadtest');

for (let i = 574621; i < 575621; i++) {

    const options = {
        url: `http://localhost:3005/restaurants/${i}/reviews`,
        maxRequests: 1
        // requestsPerSecond: 100,
        // concurrency: 100,
        // maxSeconds: 60,
        // indexParam: "value"
    };

    loadtest.loadTest(options, function (error, result) {
        if (error) {
            return console.error('Got an error: %s', error);
        }
        console.log('Tests run successfully', result);
    });

}
