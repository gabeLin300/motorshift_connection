const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const accTypes = ['Business', 'Personal']

const userSchema = new Schema({
    accType: {type: String, enum: {values: accTypes,  message: '{VALUE} is not a supported category'}, required: [true, 'An account type selection is required']},
    companyName: {type: String, required: [function(){return this.accType === 'Business'}, 'Business account was selected but no company name provided']},
    firstName: {type: String, required: [function(){return this.accType === 'Personal'}, 'Personal account was selected but no first name provided']},
    lastName: {type: String, required: [function(){return this.accType === 'Personal'}, 'Personal account was selected but no last name provided']},
    email: {type: String, required: [true, 'email field is required'], unique: true},
    password: {type: String, required: [true, 'password field is required']},
});


userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password'))
        return next();
    else {
        bcrypt.hash(user.password, 10)
        .then(hash=>{
            user.password = hash;
            next();
        })
        .catch(err=>next(err))
    }
})

userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}

const User = mongoose.model('User', userSchema)

module.exports = {User, accTypes};