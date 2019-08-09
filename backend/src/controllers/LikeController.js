const Dev = require('../models/Dev');

module.exports = {
    async store(req, res) {

        console.log(req.io, req.connectedUsers);
        
        const { user } = req.headers;
        const { devId } = req.params;

        const loggedDev = await Dev.findById(user);
        const targetDev = await Dev.findById(devId);

        if(!targetDev) {
            return res.status(400).json({ error: 'Dev not exists'});
        }

        console.log(`${loggedDev.name} deu like em ${targetDev.name}`);

        if(targetDev.likes.includes(loggedDev._id)) {
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if(loggedSocket) {
                req.io.to(loggedSocket).emit('match', targetDev);
            }
            if(targetSocket) {
                req.io.to(targetSocket).emit('match', loggedDev);
            }
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