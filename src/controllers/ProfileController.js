const Profile = require('../model/Profile')

module.exports = {
    index(req, res) {
        res.render('profile', { profile: Profile.get() })
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

        Profile.update({
            ...Profile.get(),
            ...req.body,
            "value-hours": valueHour,
        })

        return res.redirect('/profile')
    }, 
}
