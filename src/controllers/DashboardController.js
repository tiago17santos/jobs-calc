const Job = require('../model/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../model/Profile');

module.exports = {
    async index(req, res) {
        const jobs = Job.get()
        const profile = await Profile.get()

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        //total de horas por dia dos jobs em progress
        let JobTotalHours = 0

        const updateJobs = jobs.map(job => {
        
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'
            
            //somando a quantidade de jobs em determinado status
            statusCount[status] += 1

            //total de horas por dia dos jobs em progress
            JobTotalHours = status === 'progress' ? JobTotalHours += Number(job['daily-hours']) : JobTotalHours

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile['value-hours']),
            }
        })

        const freeHours = profile['hours-per-day'] - JobTotalHours

        return res.render('index', { jobs: updateJobs, profile: profile, statusCount: statusCount, freeHours: freeHours })
    }   
}
