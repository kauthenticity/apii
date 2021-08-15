exports.isLoggedIn = (req, res, next)=>{
  if(req.isAuthenticated()){
    next();
  }else{
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next)=>{
  if(!req.isAuthenticated()){
    next();
  }
  else{
    const message = encodeURIComponent('로그인한 상태입니다');
    res.redirect(`/?error=${message}`);
  }
};

const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.verifyToken = (req, res, next)=>{
  try{
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); //(first parameter : token, second parameter : secret key)
    return next();
  } catch(err){
    if(err.name==='TokenExpiredError'){
      return res.status(419).json({
        code : 419,
        message : 'token has been expired'
      });
    }
    return res.status(401).json({
      code : 401,
      message : 'invalid token',
    });
  }
};

exports.apiLimiter = new RateLimit({
  windowMs : 60*1000,
  max : 10,
  handler(req, res){
    res.status(this.statusCode).json({
      code : this.statusCode,
      message: '1분에 한번만 요청할 수 있습니다'
    });
  }
});

exports.deprecated = (req, res)=>{
  res.status(410).json({
    code : 410,
    message : '새로운 버전이 나왔습니다 새로운 버전을 사용하세요'
  });
}