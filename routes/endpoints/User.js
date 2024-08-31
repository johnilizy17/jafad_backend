require('dotenv').config();
const User = require("../../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const { tokenCallback } = require('../../functions/token');

const { verifyToken } = tokenCallback()

let routes = (app) => {
    app.post("/register", async (req, res) => {
        try {
            const { firstname, lastname, middlename, email, password, phone } = req.body;

            if (!firstname || !lastname || !email )
                return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Please enter a valid email address!" })

            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ msg: "This email already exists, please use another email address!" })

            const newUser = {
                firstname, lastname, email, middlename, phone, ...req.body
            }
            let user_ = new User(newUser);
            await user_.save();
            res.status(200).json({ msg: "Registration Successful, Please proceed to login" })

        }
        catch (err) {
            console.log('error o', err)
            return res.status(500).json({ msg: err.message });
        }

    });

    app.post("/admin/register", async (req, res) => {
        try {
            const { firstname, lastname, middlename, email, password, photo, phone } = req.body;

            console.log(firstname, lastname, middlename, email, password, phone)
            if (!firstname || !lastname || !email || !password)
                return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Please enter a valid email address!" })

            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ msg: "This email already exists, please use another email address!" })

            if (password.length < 8)
                return res.status(400).json({ msg: "Password must be atleaast 8 characters long!" })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = {
                firstname, lastname, email, middlename, password: passwordHash, photo, phone, role: "admin"
            }
            let user_ = new User(newUser);
            await user_.save();
            res.status(200).json({ msg: "Registration Successful, Please proceed to login" })

        }
        catch (err) {
            console.log('error o', err)
            return res.status(500).json({ msg: err.message });
        }

    });

    app.get("/users", async (req, res) => {


        const page = parseInt(req.query.limit) / 10 - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
            try {
                let counts = await User.find(({ email: { $regex: search, $options: "i" }, role: "user" }))
                let users = await User.find(({ email: { $regex: search, $options: "i" }, role: "user" })).limit(limit).skip(page).sort({ createdAt: -1 })
                res.json({ data: { users, pageNumber: Math.round((counts.length / 10) + 0.4) } })
            }
            catch (err) {
                res.status(500).send(err)
            }
    });

    app.get("/users/dashboard", async (req, res) => {

        try {
            let user = await User.find({role:"user"})
            let users = await User.find({role:"admin"})
            res.json({ data: { admin:users.length, user: user.length } })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.get("/users/admin", async (req, res) => {


        const page = parseInt(req.query.limit) / 10 - 1 || 0;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        try {
            let counts = await User.find(({ email: { $regex: search, $options: "i" }, role: "admin" }))
            let users = await User.find(({ email: { $regex: search, $options: "i" }, role: "admin" })).limit(limit).skip(page).sort({ createdAt: -1 })
            res.json({ data: { users, pageNumber: Math.round((counts.length / 10) + 0.4) } })
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    });

    app.put('/user/:id', async (req, res) => {
        try {
            let update = req.body;
            let user = await User.updateOne({ _id: req.params.id }, update, { returnOriginal: false });
            return res.json(user)
        }
        catch (err) {
            res.status(500).send(err)
            throw err
        }
    });

    app.delete('/user/:id', async (req, res) => {
        try {
            await User.deleteOne({ _id: req.params.id })
            res.json({ msg: "User Deleted" })
        }
        catch (err) {
            res.status(500).send(err)
        }
    });

    app.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })
            const token = createAccessToken({ id: user._id, role: user.role })
            const refresh_token = createRefreshToken({ id: user._id })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({
                msg: "Login successful!",
                userID: user._id,
                access_token: token,
                role: user.role
            })
        }
        catch (err) {
            res.status(500).send(err);
        }
    });

    app.post("/logout/:id", async (req, res) => {
        try {
            await User.updateOne({ _id: req.params.id }, { status: "inactive" }, { returnOriginal: false })
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out." })
        }
        catch (err) {
            res.status(500).send(err);
        }
    });
};

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' })
};

function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
};

module.exports = routes;