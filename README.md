# Job Queue API

Create a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

## Build Setup

	Install dependencies:

'''bash
$ npm install
'''

	Start the server:

'''bash
$ npm start
'''

	Server should be started on port 3000.

## API

### POST /jobs

Create a new job

Example request:

'''http
POST /jobs
Content-Type: application/json

{"url": "http://www.google.com"}
'''

Example Succsesful Response:

'''http
{
    "id": "59a6a8559a77502060e6adf0",
    "status": "pending",
    "timestamp": "2017-08-30T11:58:13.371Z",
    "url": "http://www.google.com"
}
'''

### GET /jobs/:jobId

Read a job using it's job ID

Example request: 

'''http
GET /jobs/59a644cf91257c071849eae
'''

Example Successful Response With Completed Job:

'''http
HTTP 200 OK
Content-Type: application/json
{
    "_id": "59a644cf91257c071849eae5",
    "url": "http://www.google.com",
    "timestamp": "2017-08-30T04:53:35.984Z",
    "status": "completed",
    "response": "<!doctype html><html>...</html>"
}
'''

Example Successful Response with Pending/Ongoing Job: 

'''http
HTTP 200 OK
Content-Type: application/json
{
	"_id": "59a644cf91257c071849eae5",
	"url": "http://www.google.com",
	"timestamp": "2017-08-30T04:53:35.984Z",
	"status": "pending" OR "ongoing"
}
'''