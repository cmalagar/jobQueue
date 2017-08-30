var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema({
	response: {
		type: String,
		default: ''
	},
	status: {
		type: String,	
		default: 'pending',
		required: true,
		enum: ['pending', 'ongoing', 'completed', 'error']
	},
	timestamp: {
		type: Date,
		default: Date.now
	},
	url: {
		type: String,
		required: 'Provide URL for worker to fetch data from'
	}
}, {
	versionKey: false
});

JobSchema.method('completeJob', function (res) {	
	return new Promise((resolve, reject) => {
		this.set('response', res);
		this.set('status', 'completed');

		resolve(this);
	}).then((val) => {
		val.save();
	}).catch((reason) => {
		console.log('Rejected promise: %s', reason);
	});
});

JobSchema.method('jobError', function (res) {
	return new Promise((resolve, reject) => {
		this.set('response', res);
		this.set('status', 'error');

		resolve(this);
	}).then((val) => {
		val.save();
	}).catch((reason) => {
		console.log('Rejected promise: %s', reason);
	});
})

module.exports = mongoose.model('Jobs', JobSchema);