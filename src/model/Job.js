let data = [
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
]

module.exports = {
    get(){
        return data
    },

    update(newJob){
        data = newJob    
    },

    delete(id){
        data = data.filter(job => Number(job.id) !== Number(id))
    }
}