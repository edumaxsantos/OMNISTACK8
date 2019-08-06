const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {
        const { user } = req.headers;
        const { devId } = req.params;

        console.time('Encontrar devs');

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        console.timeEnd('Encontrar devs');

        if(!targetDev) {
            return res.status(400).json({ error: 'Dev not exists'});
        }

        if(targetDev.likes.includes(loggedDev._id)) {
            console.log('DEU MATCH');
        }

        loggedDev.likes.push(targetDev._id);

        await loggedDev.save();

        return res.json(loggedDev);


/* ESTE TRECHO AQUI É MAIS RÁPIDO POR CONTA DE COMO É TRATADO O AWAIT
        try {
            console.time('Encontrar devs');

            const loggedDev = Dev.findById(user);
            const targetDev = Dev.findById(devId);
            const [logged, target] = await Promise.all([loggedDev, targetDev]);

            console.timeEnd('Encontrar devs');
            
            if(!target) {
                return res.status(400).json({ error: 'Dev not exists'});
            }

            if(target.likes.includes(logged._id)) {
                console.log('DEU MATCH');
            }

            logged.likes.push(target._id);

            await logged.save();

            return res.json(logged);
        } catch(err) {
            console.log(err);
            return res.status(500).json({error: err});
        } */
    }
}