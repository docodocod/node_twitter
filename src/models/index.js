const Sequelize=require("sequelize");
const env=process.env.NODE_ENV || "development";
const config=require("../../config/config.json")[env];
const User=require('../models/user');
const Post=require('../models/post');
const Hashtag=require('../models/hashtag');
const Room=require('../models/room');
const Chat=require('../models/chat');


const db={};
const sequelize=new Sequelize(
        config.database,
        config.username,
        config.password,
        config
);

db.sequelize=sequelize;
db.User=User;
db.Post=Post;
db.Hashtag=Hashtag;
db.Room=Room;
db.Chat=Chat;


User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Room.init(sequelize);
Chat.init(sequelize);



User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Room.associate(db);
Chat.associate(db);


module.exports=db;