const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const {sendWelcomeEmail} = require('../emails/account');
const router = new express.Router();

const UpdateableUserProperties = ['name', 'password', 'email', 'age'];

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.getAuthenticationToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e)
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.getAuthenticationToken();
        res.send({ user, token });
    } catch (error) {
        console.log(error, req);
        res.status(400).send('User Id/Password did not match.');
    }
});

router.post('/users/logout', authMiddleware, async (req, res) => {
    const user = req.user;
    const token = req.token;

    user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== token);
    await user.save();
    //console.log(token, user);
    res.send('Logout successful');
});

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.send(user);
})

router.get('/user/me', authMiddleware, async (req, res) => {
    if (req.user)
        res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params['id']);
        if (!!user)
            res.status(200).send(user);
        else
            res.status(404).send("User not found");
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch("/users/me", authMiddleware, async (req, res) => {
    try {
        const user = req.user;

        for (prop in req.body) {
            if (UpdateableUserProperties.indexOf(prop) !== -1) {
                user[prop] = req.body[prop];
            }
        }
        //console.log(user, req.body);
        user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/users/me", authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        //console.log(user);
        user.delete();
        res.send(user);
    } catch (error) {
        res.status(500).send();
    }
});

const upload = multer({
    //dest: 'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/i))
            return cb(new Error('Please upload an image file'));
        cb(undefined, true);
    },

});
router.post("/users/me/avatar",authMiddleware, upload.single('avatar'), async (req, res) => {
    //req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer).png().resize({width: 250, height: 250}).toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    //console.log(error);
    res.status(500).send(error.message);
})
router.delete("/users/me/avatar", authMiddleware, async (req,res)=>{
    const user = req.user;
    user.avatar = undefined;
    await user.save();
    res.send();
});
router.get("/users/:id/avatar", async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if(!!user && !!user.avatar) {
            res.set('Content-Type', 'image/png');
            res.send(user.avatar);
            return;
        }
        //console.log("User not found ", req.params.id)
        res.status(404).send();
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;
