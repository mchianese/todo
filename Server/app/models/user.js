var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var bcryptjs = require('bcryptjs') ;

var userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  screenName: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/} , 
  password: {type: String, required: true },
  registerDate: { type: Date, default: Date.now }

});


userSchema.virtual('fullName')
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

userSchema.methods.comparePassword = function (passw, cb) {
    bcryptjs.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = Mongoose.model('User', userSchema);

userSchema.pre('save', function (next) {
    var person = this;
    if (this.isModified('password') || this.isNew) { 
       bcryptjs.genSalt(10, function (err, salt) {
            if (err) { 
               return next(err); 
           }
            bcryptjs.hash(person.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                person.password = hash;
                next();
            });
        });
    } else { 
       return next();
    }
});


