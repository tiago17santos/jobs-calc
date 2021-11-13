module.exports = {
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
    
}