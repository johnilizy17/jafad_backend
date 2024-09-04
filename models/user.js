const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    middlename: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, minlength: 8 },
    phone: { type: String, minlength: 10, maxlength: 11 },
    religion: { type: String },
    subject: {
        type: Array
    },
    achievement: {
        type: Array
    },
    dateofbirth: {
        type: String
    },
    streetaddress: {
        type: String
    },
    town: {
        type: String
    },
    state: {
        type: String
    },
    local: {
        type: String
    },
    nationality: {
        type: String
    },
    gender:{
        type:String
    },
    photo: {
        type: String
    },
    payment: {
        type: Boolean, default:false
    },
    NameSponsor: {
        type: String
    },
    AddressSponsor: {
        type: String
    },
    PhoneSponsor: {
        type: String
    },
    SponsorOccupation: {
        type: String
    },
    SponsorEmail: {
        type: String
    },
    payment: {
        type: Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ['user', "admin"],
        default: 'user'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        },
    },
    timestamps: true
});

const User = mongoose.model('users', UserSchema);

module.exports = User;