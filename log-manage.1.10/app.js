var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var helmet =  require('helmet');
var csp = require('helmet-csp');
var featurePolicy = require('feature-policy');
var hpkp = require('hpkp');
var referrerPolicy = require('referrer-policy');

var rateLimit = require('express-rate-limit');

// Define All Middlewares
const RequestCheckerMiddlewareWeb = require('./middlewares/RequestCheckerWeb');
const RequestCheckerMiddlewareMobile = require('./middlewares/RequestCheckerMobile');

// Define All Routers

var KenhHaiLogRouterWeb = require('./routes/KenhHai/web');
var KenhHaiLogRouterMobile = require('./routes/KenhHai/mobile');
var KenhHaiLogRouterWebHttps = require('./routes/KenhHai/web-https');
var UtilServicesRouterWeb = require('./routes/KenhHai/utilServices');

var app = express();

/**
 * use helmet package for:
 * 
 */
app.use(helmet());

app.use(helmet.referrerPolicy());
app.use(helmet.hidePoweredBy());
app.use(helmet.noCache());

app.use(helmet.frameguard());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
  }
}));

app.use(helmet.xssFilter());

app.use(csp({
  directives: {
    defaultSrc: ["'self'", 'default.com'],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/errors/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false  // This is not set.
  }
}));

app.use(featurePolicy({
  features: {
    vibrate: ["'self'"],
    syncXhr: ["'none'"]
  }
}));

// 90 day
const ninetyDaysInSeconds = 7776000
const oneDay = 3600 * 24;
app.use(hpkp({
  maxAge: oneDay,
  sha256s: ['AbCdEfijklmnopq123=', 'GHYJKZyXwVu456=']
}));

// 60 day 
const sixtyDaysInSeconds = 5184000;
app.use(helmet.hsts({
  maxAge: sixtyDaysInSeconds
}));

app.use(referrerPolicy({ policy: 'no-referrer' }));


/**
 * use express rate limit request
 */
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
 
const limiter_web = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hours
  max: 1000, // limit each IP to 3600 requests per windowMs
  message: "Bạn Đã Gửi Quá Nhiều Requet Từ Browser Lên Hệ Thống, Vui Lòng Quay Lại Sau Ít Phút Nữa....."
});

const limiter_mobile = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hours
  max: 1000, // limit each IP to 3600 requests per windowMs
  message: "Bạn Đã Gửi Quá Nhiều Requet Từ Mobile Lên Hệ Thống, Vui Lòng Quay Lại Sau Ít Phút Nữa....."
});
//// apply to all requests
// app.use(limiter);
// end rate limit

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// cors call api from domain difficult
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, X-CSRF-TOKEN");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
/**
 * use middleware for kenhhai web
 * all request from client use Web/wap
 * check data, resolve or reject request
 */
app.use('/kenh-hai/web', limiter_web);
app.use('/kenh-hai/web', RequestCheckerMiddlewareWeb);
app.use('/kenh-hai/web', KenhHaiLogRouterWeb);

/**
 * demo use https protocol
 * use middleware for kenhhai web
 * all request from client use Web/wap
 * check data, resolve or reject request
 */
app.use('/web/all', limiter_web);
app.use('/web/all', RequestCheckerMiddlewareWeb);
app.use('/web/all', KenhHaiLogRouterWebHttps);

/**
 * use middleware for kenhhai mobile
 * all request from client use mobile
 * check data, resolve or reject request
 */
app.use('/kenh-hai/mobile', limiter_mobile);
app.use('/kenh-hai/mobile', RequestCheckerMiddlewareMobile )
app.use('/kenh-hai/mobile', KenhHaiLogRouterMobile);


/**
 * use Utils service for web
 */
app.use('/api/util-service', UtilServicesRouterWeb);
// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  // next(createError(404));
  console.error(err.stack);
  res.status(400);
  res.send({ 
      error_code: '400',
      error_message: 'Get / Put / Delete method not allowed....' 
  });
  next();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * Cookie setup
 */
// app.use(cookieSession({
//   name: 'session',
//   keys: [
//     process.env.COOKIE_KEY1,
//     process.env.COOKIE_KEY2
//   ]
// }));
 
// app.use(function (req, res, next) {
//   var n = req.session.views || 0;
//   req.session.views = n++;
//   res.end(n + ' views');
//   next();
// });


module.exports = app;
