import {createRoomService, selectAllRoom, selectOneRoom} from "../dao/room.js";
import {removeRoomService} from "../service/roomDelete.js";


export async function renderMainRoom(req, res, next){
    try {
        const rooms = await selectAllRoom();
        res.render('roomMain', { rooms, title: 'GIF 채팅방' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};;

export async function renderRoom(req, res){
    res.render('room', { title: 'GIF 채팅방 생성' });
};

export async function createRoom(req, res, next) {
    try {
        const title=req.body.title
        const max=req.body.max
        const owner=req.session.color
        const password=req.body.password
        const newRoom = await createRoomService(title,max,owner,password);
        const io = req.app.get('io');
        io.of('/room').emit('newRoom', newRoom);
        if (req.body.password) { // 비밀번호가 있는 방이면
            res.redirect(`/room/${newRoom._id}?password=${password}`);
        } else {
            res.redirect(`/room/${newRoom._id}`);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export async function enterRoom(req, res, next){
    try {
        const RoomNumber=req.query.id;
        const RoomPassword=req.query.password;
        const room = await selectOneRoom(RoomNumber);
        if (!room) {
            return res.redirect('/?error=존재하지 않는 방입니다.');
        }
        if (room.password!==RoomPassword) {
            return res.redirect('/?error=비밀번호가 틀렸습니다.');
        }
        const io = req.app.get('io');
        const { rooms } = io.of('/chat').adapter;
        console.log(rooms, rooms.get(req.params.id), rooms.get(req.params.id));
        if (room.max <= rooms.get(req.params.id)?.size) {
            return res.redirect('/?error=허용 인원이 초과하였습니다.');
        }
        const chats = await Chat.find({ room: room._id }).sort('createdAt');
        return res.render('chat', {
            room,
            title: room.title,
            chats,
            user: req.session.color,
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

export async function removeRoom(req, res, next){
    try {
        const RoomNumber=req.query.id;
        await removeRoom(RoomNumber);
        res.send('채팅방이 삭제 되었습니다.');
    } catch (error) {
        console.error(error);
        next(error);
    }
};