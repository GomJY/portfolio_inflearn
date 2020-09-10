exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};
exports.isLoggedIn_OnlyStudent = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.authority == 100)
            next();
        else 
            res.status(404).send("잘못된 접근입니다.");
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.teacher_isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.authority >= 200)
            next();
        else 
            res.status(404).send("잘못된 접근입니다.");
    } else {
        res.status(403).send('로그인 필요');
    }
};
