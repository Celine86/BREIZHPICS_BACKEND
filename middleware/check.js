exports.mail = (req, res, next) => {
    const checkEmail = function(email) {
        let mailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
        if(email !== '' && email.match(mailFormat)){
            next();
        }
        else{
            res.status(401).json({error: 'Merci de vérifier votre mail. Il doit être sous la forme pseudo@mail.mail. Par exemple JohnDoe@breizpics.bzh'});
        }
    }
    checkEmail(req.body.email)
};

exports.password = (req, res, next) => {
    const checkPswd = function(pswd) {
        let pswdFormat = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{12,}$/
        if(pswd !== '' && pswd.match(pswdFormat)){
            next();
        }
        else{
            res.status(401).json({error: 'Le mot de passe doit contenir au moins 12 caractères avec une majuscule, une minuscule, un chiffre et un caractère spécial'});
        }
    }
    checkPswd(req.body.password)
};