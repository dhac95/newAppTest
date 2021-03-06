
var express = require('express');
var md5 = require('md5');  
var router = express.Router();  
var dateFormat = require('dateformat');
var datetime = require('node-datetime');
var strtotime = require('strtotime');
var nodestrtotime = require('nodestrtotime');
var generator = require('generate-password');
var nodemailer = require('nodemailer');
var db = require('../dbconnections');
var moment = require('moment');
var sendmail = require('sendmail')();

router.post('/' , function(req , res , next){ 
    var password = generator.generate({
        length: 10,
        numbers: true,
       // symbols : true , 
       // excludeSimilarCharacters : true
    });

        var pass = md5(password);
        var user = req.body.name; 
        var email = user + '@amazon.com';

        db.query("select * from amz_login where user_name = ?" , [user] , function(e , r , f){
            if(r.length > 0) {
                db.query("UPDATE amz_login SET password = ? WHERE amz_login.user_name = ?" ,[pass , user] , function(errors , results , fields) {
                    if(errors) {
                            res.send(errors);
                    }
                    else  {
                        var today = moment().format('LLLL');
                      //  nodemailer.createTestAccount(function(err, account) {

                      sendmail({
                          from: '"PPMS Admin 👻" <no-reply.ppms@amazon.com>',
                          to: email,
                          subject: 'Password change request ✔', // Subject line
                          html: '<b> Hi ' + user + ',</b><br /> Your mail id is used to request a new password at ' + today + '. Use this temp password to update your password later. Your password is : <strong> ***' + password + '***</strong> <br /> If you are not requested for password change please contact your manager for further actions.<b><br /> Thanks</b>' // html body
                      }, function (err, reply) {
                          console.log(err && err.stack);
                          console.dir(reply);
                      });
        
                            // create reusable transporter object using the default SMTP transport
                        //     var transporter = nodemailer.createTransport({
                        //         // host: 'smtp.ethereal.email',
                        //         // port: 587,
                        //             service : 'Gmail' , 
                        //        // secure: false, // true for 465, false for other ports
                        //         auth: {
                        //             user: process.env.MAIL_U, // generated ethereal user
                        //             pass: process.env.MAIL_P  // generated ethereal password
                        //         }
                        //     });
                        
                        //     // setup email data with unicode symbols
                        //     var mailOptions = {
                        //         from: '"Fred Foo 👻" <admin_no-reply.p2r@amazon.com>', // sender address
                        //         to: email, // list of receivers
                        //         subject: 'Password change request ✔', // Subject line
                        //         text: password, // plain text body
                        //         html: '<b> Hi ' + user + ',</b><br /> Your mail id is used to request a new password at ' + today + '. Use this temp password to update your password  <strong> ***'+ password +'***</strong> <br /> If you are not requested for password change please contact your manager for further actions.<b><br /> Thanks</b>' // html body
                        //     };
                        
                        //     // send mail with defined transport object
                        //     transporter.sendMail(mailOptions, function(error, info) {
                        //         if (error) {
                        //             return console.log(error);
                        //         }
                            
                        // });
                        res.send({
                            "code" : 200,
                            "success" : "passed",
                            "results" : results
                        });
                        
                    }
               });
            }
            else {
                res.send({
                        "code" : 300 , 
                        "message" : "User does not exist"
                });
            }
        });
    });
        
module.exports = router;



