const express = require('express')
const routes = express.Router()

//caminho para a pasta
const views = __dirname + '/views/'

const Profile = {
    data: {
        name: 'Tiago',
        avatar: 'https://github.com/tiago17santos.png',
        "monthly-budget": 3000,
        "hours-per-day": 5,
        "days-per-week": 5,
        "vacation-per-year": 4,
        "value-hours": 70,
    },

    controllers: {
        index(req, res) {
            res.render(views + 'profile', { profile: Profile.data })
        },

        update(req, res){
            //req.body para pegar os dados
            const data = req.body

            //definir quantas semanas tem no ano: 52
            const weeksPerYear = 52
            
            //remover as semanas de ferias do ano, pegar quantas semanas tem 1 mes
            const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12
            
            //total de horas trabalhadas na semana
            const weeksTotalHours = data['hours-per-day'] * data['days-per-week']  
            
            //total de horas trabalhadas no mes
            const monthlyTotalHours = weeksTotalHours * weeksPerMonth  
            
            //qual será o valor da minha hora?
            const valueHour = data["monthly-budget"] / monthlyTotalHours

            console.log(req.body)

            Profile.data = {
                //...Profile.data,
                ...req.body,
                "value-hours": valueHour,
            }

            return res.redirect('/profile')
        }, 
    }
    
} 



const Job = {
    data:[
        {
            id: 1,
            name: 'Pizzaria Guloso',
            'daily-hours': 2,
            'total-hours': 1,
            created_at: Date.now(), //pega a data de criação do job
          
            
        },
        {
            id: 2,
            name: 'ONETWO Project',
            'daily-hours': 3,
            'total-hours': 47,
            created_at: Date.now(),
            
        },
    ],

    controllers:{
        index(req, res) {
            const updateJobs = Job.data.map(job => {
            
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.calculateBudget(job, Profile.data['value-hours']),
                }
            })

            return res.render(views + 'index', { jobs: updateJobs })
        },

        create(req, res) {
             res.render(views + 'job')
        },

        save(req, res){
            //{ name: 'asdsad', 'daily-hours': '1', 'total-hours': '12' }
            const lastId = Job.data[Job.data.length - 1]?.id || 0

            Job.data.push({
                id: lastId + 1,
                name: req.body.name,
                'daily-hours': req.body['daily-hours'],
                'total-hours': req.body['total-hours'],
                created_at: Date.now(),
            })

            return res.redirect('/')
        },

        show(req, res){
            const jobId = req.params.id 

            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            
            if(!job){
                return res.send('Job not found')
            }
           
            //passar o budget para o job-edit.ejs
            job.budget = Job.services.calculateBudget(job, Profile.data['value-hours'])
            
            return res.render(views + 'job-edit', { job })
        },

        update(req, res){
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId))
            
            if(!job){
                return res.send("Job not found")
            }
            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body['total-hours'],
                "daily-hours": req.body['daily-hours'],
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)){
                    job = updatedJob
                }
                return job
            })

            res.redirect('/')

        },

        delete(req, res){
            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))


            return res.redirect('/')
        }

    },

    services:{
        remainingDays(job){
            //calculo do tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() 
        
            //pegando dia em que foi criado o job
            const createdDate = new Date(job.created_at)
            //dia final do vencimento
            const dueDay = createdDate.getDate() + Number(remainingDays)    
            //data exata do vencimento
            const dueDateInMS = createdDate.setDate(dueDay)
            
            //diferença entre a data final(vencimento) e o dia atual
            const timeDiffInMs = dueDateInMS - Date.now()
            //transformar milisegundos em dias 
            const daysInMs = 1000 * 60 * 60 * 24
        
            //diferença de dias que restam para vencimento
            const dayDiff = Math.floor(timeDiffInMs / daysInMs)
        
            return dayDiff
        
        },
        
        calculateBudget: (job, valueHour) =>  valueHour * job["total-hours"]
        
    },
}


routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)

module.exports = routes