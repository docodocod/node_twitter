import User from "../schema/user.js";
import Post from "../schema/post.js";
import Hashtag from "../schema/hashtag.js";

export function renderProfile(req, res){
    res.render('profile', { title: '내 정보 - NodeBird' });
};
export function renderJoin(req, res) {
    res.render('join', { title: '회원가입 - NodeBird' });
};

export async function renderMain (req, res, next) {
    try {
        const posts = await Post.findAll({
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
            order: [['createdAt', 'DESC']],
        });
        res.render('main', {
            title: 'NodeBird',
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function renderHashtag (req, res, next) {
    const query = req.query.hashtag;
    if (!query) {
        return res.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({ where: { title: query } });
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({ include: [{ model: User }] });
        }
        return res.render('main', {
            title: `${query} | NodeBird`,
            twits: posts,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};