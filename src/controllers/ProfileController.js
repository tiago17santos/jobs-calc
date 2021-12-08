const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        res.render('profile', { profile: await Profile.get() })
    },

    async update(req, res){
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

        const profile = await Profile.get()

        await Profile.update({
            ... profile,
            ...req.body,
            "value-hours": valueHour,
        })

        return res.redirect('/profile')
    }, 
}
