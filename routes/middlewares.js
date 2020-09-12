exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).json({code: 403, message: '로그인 필요'});
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
            res.status(404).json({code: 404, message: '잘못된 접근입니다'});
    } else {
        res.status(403).json({code: 403, message: '로그인 필요'});
    }
};

exports.isLoggedIn_highTeacher = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.authority >= 200)
            next();
        else 
            res.status(404).json({code: 404, message: '잘못된 접근입니다'});
    } else {
        res.status(403).json({code: 403, message: '로그인 필요'});
    }
};
