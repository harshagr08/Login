const User = require('../models/user')
const bcrypt = require('bcrypt')


exports.getLogin = (req, res) =>{
    let flash = req.flash("error")
    let errormessage = null
    if(flash){
        errormessage = flash[0]
    }
    else {
        errormessage = null
    }

    return res.render("login", { flash: errormessage })
}


exports.getSignUp = (req, res ) =>{
    res.render("index")
}

exports.postSignUp = (req,res) => {
    const name = req.body.name
    const password = req.body.password
    const email = req.body.email

    User.findOne({ email }).then(user =>{
        if(user)
        {
            req.flash("error", "Already exist")
            return res.redirect("/login")
        }
        bcrypt.hash(password, 8)
            .then(result =>{
                const user = new User({
                    email,
                    password: result,
                    resettoken: undefined,
                    name
                })
                return user.save()
            })
            .then(() => {
                res.redirect("/login");
            });
    })
}


exports.postLogin = (req, res) =>{
    const email = req.body.email
    const password = req.body.password

    User.findOne({ email }).then(user =>{
        if(!user)
        {
            req.flash("error", "No account")

            return res.redirect("signup")
        }
        bcrypt.compare(password, user.password).then(result =>{
            if(result)
            res.send("Welcome bro")
            else
            res.redirect("/signup")
        })
    })
}