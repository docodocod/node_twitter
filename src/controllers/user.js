const User=require("../models/user.js");

exports.follow=async(req, res, next)=>{
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            await user.add(parseInt(req.params.id, 10));
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};