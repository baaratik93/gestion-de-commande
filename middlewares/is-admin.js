const { User } = require('../models')

module.exports = async(req, res, next) =>{
    const user = await User.findOne({
        where: {
            id: req.user.userId
        },
        include: 'roled'
    })
    req.role = user.roled.title
    next()
}