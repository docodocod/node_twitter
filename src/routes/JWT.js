import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const Config=dotenv.config({path:"./config/env.app"}).parsed;
import {verifyToken} from "../modules/verifyToken.js";

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const id = req.body.email;
        const nick = req.body.nick;
        // jwt.sign() 메소드: 토큰 발급
        const token = jwt.sign({
            id,
            nick,
        },Config.JWT_SECRET, {
            expireIn: '10m',
            issuer: '토큰 발급자',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token,
        })}catch (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        }
    });
router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});
export default router;