var mongoose = require('mongoose'),
	Job = mongoose.model('Jobs'),
	http = require('http'),
	kue = require('kue'),
	queue = kue.createQueue();

module.exports.create_job = (req, res, next) => {
	var new_job = new Job({url: req.body.url});

	new_job.save((err, job) => {
		if (err) {
			return res.status(400).json('Invalid URL');
		}

		processResponse(res, job);

		return runJob(job);	

		next();
	});
};

// module.exports.read_jobs = (req, res, next) => {
// 	Job.find({}, (err, job) => {
// 		if (err) {
// 			return res.status(400).json('Invalid request');
// 		}
// 		return res.json(job);
// 		next();
// 	});
// };

module.exports.read_job = (req, res, next) => {
	Job.findById(req.params.jobId, (err, job) => {
		if (err) {
			return res.status(404).json({message: 'Job ID not found'});
		}

		return processResponse(res, job);

		next();
	});
};


/** Utility Functions */

function processResponse(res, job) {
	if (job && (job.status === 'completed' || job.status === 'error')) {
		res.json(job);	
	} else {
		res.json({
			id: job._id,
			status: job.status,
			timestamp: job.timestamp,
			url: job.url 
		});
	}
}

function runJob(job) {
	job.status = 'ongoing';

	return new Promise((resolve, reject) => {
		let request = http.get(job.url, (res) => {
			if (res.statusCode < 200 || res.statusCode >= 300) {
				return reject(new Error('statusCode was ' + res.statusCode));
			}

			let body = "";

			res.on("data", (chunk) => {
				body += chunk;
			}).on("end", () => {
				job.completeJob(body);
			});
		});
	}).catch((err) => {
		// For now, handle invalid URL like this. Right now, I am not checking if the URL input is valid 
		// until after the job is created. This validation should happen when the user makes a request, 
		// not when the job has already been submitted.
		console.log('Invalid URL: ', err.message + ". Ensure that http:// is at the beginning of the url.");
		job.jobError(err.message);
	});
}
