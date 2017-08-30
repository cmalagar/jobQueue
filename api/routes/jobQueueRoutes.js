module.exports = function (app) {
	var jobQueue = require('../controllers/jobQueueController');

	// Job Queue Routes
	app.route('/jobs')
		// .get(jobQueue.read_jobs)
		.post(jobQueue.create_job);

	app.route('/jobs/:jobId')
		.get(jobQueue.read_job);

	app.use(function (req, res) {
		res.status(404)
			.json({
				url: req.originalUrl + ' not found'
			});
	});
};