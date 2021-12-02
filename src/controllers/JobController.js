const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');

module.exports = {
    index(req, res) {
        const jobs = Job.get()
        const profile = Profile.get()

        const updateJobs = jobs.map(job => {
        
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'
    
            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile['value-hours']),
            }
        })

        return res.render('index', { jobs: updateJobs })
    },

    create(req, res) {
         res.render('job')
    },

    save(req, res){
        const jobs = Job.get()

        //{ name: 'asdsad', 'daily-hours': '1', 'total-hours': '12' }
        const lastId = jobs[jobs.length - 1]?.id || 0

        jobs.push({
            id: lastId + 1,
            name: req.body.name,
            'daily-hours': req.body['daily-hours'],
            'total-hours': req.body['total-hours'],
            created_at: Date.now(),
        })

        return res.redirect('/')
    },

    show(req, res){
        const jobs = Job.get()
        const profile = Profile.get()

        const jobId = req.params.id 

        const job = jobs.find(job => Number(job.id) === Number(jobId))
        
        if(!job){
            return res.send('Job not found')
        }
       
        //passar o budget para o job-edit.ejs
        job.budget = JobUtils.calculateBudget(job, profile['value-hours'])
        
    },

    update(req, res){
        const jobs = Job.get()

        const jobId = req.params.id
        
        const job = jobs.find(job => Number(job.id) === Number(jobId))
        
        if(!job){
            return res.send("Job not found1")
        }
        const updatedJob = {
            ...job,
            name: req.body.name,
            "total-hours": req.body['total-hours'],
            "daily-hours": req.body['daily-hours'],
        }

        newJobs = jobs.map(job => {
            if(Number(job.id) === Number(jobId)){
                job = updatedJob
            }
            return job
        })

        Job.update(newJobs)

        res.redirect('/')

    },

    delete(req, res){
        const jobId = req.params.id

        Job.delete(jobId) 

        return res.redirect('/')
    }

}