var express = require('express');
var md5 = require('md5');
var router = express.Router();
var nodestrtotime = require('nodestrtotime');
var in_array = require('in_array');
var db = require('../dbconnections');
var moment = require('moment');
var async = require("async");

function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-4) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function secondsToAvg(num) {
    num = Number(num);

    var h = Math.floor(num / 3600);
    var m = Math.floor(num % 3600 / 60);
    var value = (h + m) / 8;
    return value;
}

router.post('/', function (req, res, next) {
    var where1, where2, where3, where4, where5, where6, whereN;
    where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";

    var d1 = moment(req.body.From).format('YYYY-MM-DD');
    var d2 = moment(req.body.To).format('YYYY-MM-DD');
    var team = req.body.team_id;
    var task = req.body.tasks_id;
    var subTask = req.body.sub_task_id;
    var userID = req.body.user_id;
    var taskDesc = req.body.task_desc;
    var userOT = req.body.user_ot;

    var secs = 0;
    var count = 0;
    var wu = 0;
    var TotalHours = 0;
    if (userOT) {
        if (d1 == "" && d2 == "") {

        } else if (d1 == "" && d2 != "") {

        } else if (d1 != "" && d2 == "") {

        } else {
            where1 = " date between ? and ?";
        }
        if (team != "") {
            where2 = " AND user_tasks_ot.team_id = " + team;
        }
        if (task != undefined && task.length != 0) {
            where3 = " AND user_tasks_ot.tasks_id in (" + task + ")";
        }
        if (subTask != undefined && subTask.length != 0) {
            where4 = " AND user_tasks_ot.sub_task_id in (" + subTask + ")";
        }
        if (taskDesc != undefined) {
            where5 = " AND user_tasks_ot.task_desc = " + taskDesc;
        }
        if (userID != undefined && userID.length != 0) {
            where6 = " AND user_tasks_ot.user_id in (" + userID + ")";
        }
        whereN = where1 + where2 + where3 + where4 + where5 + where6;

        // var secs = 0;
        // var count = 0;
        // var wu = 0;
        db.query("SELECT user_tasks_ot.time , user_tasks_ot.count, user_tasks_ot.wu , amz_tasks.task_name AS task_name FROM user_tasks_ot INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id where " + whereN + " and task_name NOT LIKE '%Absence' and wu_status = 1", [d1, d2], function (error, results, fields) {
            if (error) {
                res.send(error);

            } else {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                    }
                    for (var j = 0; j < results.length; j++) {
                        count = count + results[j].count;
                    }
                    for (var k = 0; k < results.length; k++) {
                        wu = wu + results[k].wu;
                    }
                    wu = Number(wu).toFixed(2);
                    TotalHours = secondsToHms(secs);
                    var diffHour = secondsToAvg(secs);
                    var avgWu = wu / diffHour;

                    res.json({
                        "total": TotalHours,
                        "workunit": wu,
                        "Count": count,
                        "AverageWorkUnit": avgWu
                    });
                } else {
                    TotalHours = 0;
                    res.json({
                        total: TotalHours
                    });
                }
            }
        });

    } else {
        if (d1 == "" && d2 == "") {

        } else if (d1 == "" && d2 != "") {

        } else if (d1 != "" && d2 == "") {

        } else {
            where1 = " date between ? and ?";
        }
        if (team != "") {
            where2 = " AND user_tasks.team_id = " + team;
        }
        if (task != undefined && task.length != 0) {
            where3 = " AND user_tasks.tasks_id in (" + task + ")";
        }
        if (subTask != undefined && subTask.length != 0) {
            where4 = " AND user_tasks.sub_task_id in (" + subTask + ")";
        }
        if (taskDesc != undefined) {
            where5 = " AND user_tasks.task_desc = " + taskDesc;
        }
        if (userID != undefined && userID.length != 0) {
            where6 = " AND user_tasks.user_id in (" + userID + ")";
        }
        whereN = where1 + where2 + where3 + where4 + where5 + where6;

        // var secs = 0;
        // var count = 0;
        // var wu = 0;
        db.query("SELECT user_tasks.time , user_tasks.count, user_tasks.wu , amz_tasks.task_name AS task_name FROM user_tasks INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id where " + whereN + " and task_name NOT LIKE '%Absence' and wu_status = 1", [d1, d2], function (error, results, fields) {
            if (error) {
                res.send(error);

            } else {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                    }
                    for (var j = 0; j < results.length; j++) {
                        count = count + results[j].count - 0;
                    }
                    for (var k = 0; k < results.length; k++) {
                        wu = wu + results[k].wu - 0.0;
                    }
                    wu = Number(wu).toFixed(2);
                    TotalHours = secondsToHms(secs);
                    var diffHour = secondsToAvg(secs);
                    var avgWu = Number(wu / diffHour).toFixed(2);
                    res.json({
                        "total": TotalHours,
                        "workunit": wu,
                        "Count": count,
                        "AverageWorkUnit": avgWu
                    });
                } else {
                    TotalHours = 0;
                    res.json({
                        total: TotalHours
                    });
                }
            }
        });

    }

});

router.post('/task', function (req, res, next) {
    var where1, where2, where3, where4, where5, where6, whereN;
    where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";

    var d1 = moment(req.body.From).format('YYYY-MM-DD');
    var d2 = moment(req.body.To).format('YYYY-MM-DD');
    var team = req.body.team_id;
    var task = req.body.tasks_id;
    var subTask = req.body.sub_task_id;
    var userID = req.body.user_id;
    var taskDesc = req.body.task_desc;
    var userOT = req.body.user_ot;

    var taskData = [];
    var queryError = [];

    db.query('SELECT * FROM amz_tasks where status = 1 and deletion = 0 and team_id = ?', [team], function (e, r, f) {


        if (userOT) {
            if (d1 == "" && d2 == "") {

            } else if (d1 == "" && d2 != "") {

            } else if (d1 != "" && d2 == "") {

            } else {
                where1 = " date between ? and ?";
            }
            if (team != "") {
                where2 = " AND user_tasks_ot.team_id = " + team;
            }
            if (task != undefined && task.length != 0) {
                where3 = " AND user_tasks_ot.tasks_id in (" + task + ")";
            }
            if (subTask != undefined && subTask.length != 0) {
                where4 = " AND user_tasks_ot.sub_task_id in (" + subTask + ")";
            }
            // if (taskDesc != undefined) {
            //     where5 = " AND user_tasks_ot.task_desc = " + taskDesc;
            // }
            if (userID != undefined && userID.length != 0) {
                where6 = " AND user_tasks_ot.user_id in (" + userID + ")";
            }
            whereN = where1 + where2 + where3 + where4 + where5 + where6;

            // var secs = 0;
            // var count = 0;
            // var wu = 0;
            async.each(r, function (single, callback) {
                var secs = 0;
                var count = 0;
                var wu = 0;
                var TotalHours = 0;

                db.query(" SELECT user_tasks_ot.time , user_tasks_ot.count, user_tasks_ot.wu , amz_tasks.task_name AS task_name FROM user_tasks_ot INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id where " + whereN + " AND user_tasks_ot.tasks_id = ? and wu_status = 1", [d1, d2, single.task_id], function (error, results, fields) {
                    if (error) {
                        queryError.push(error);
                    } else {
                        if (results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                            }
                            for (var j = 0; j < results.length; j++) {
                                count = count + results[j].count;
                            }
                            for (var k = 0; k < results.length; k++) {
                                wu = wu + results[k].wu;
                            }
                            wu = Number(wu).toFixed(2);
                            TotalHours = secondsToHms(secs);
                            var diffHour = secondsToAvg(secs);
                            var avgWu = Number(wu / diffHour).toFixed(2);

                            taskData.push({
                                "total": TotalHours,
                                "workunit": wu,
                                "Count": count,
                                "AverageWorkUnit": avgWu,
                                "TaskName": single.task_name,
                            });

                            // res.json({
                            //     "total": TotalHours,
                            //     "workunit": wu,
                            //     "Count": count,
                            //     "AverageWorkUnit": avgWu,
                            //     "TaskName" : single.task_name,
                            // });
                        }
                        // else {
                        //     var TotalHours = 0;
                        //     res.json({
                        //         total: TotalHours
                        //     });
                        // }
                    }
                    callback();
                });
            }, function (response) {
                if (queryError.length > 0) {
                    res.send(queryError);
                } else {
                    res.send(taskData);
                }
            });

        } else {
            if (d1 == "" && d2 == "") {

            } else if (d1 == "" && d2 != "") {

            } else if (d1 != "" && d2 == "") {

            } else {
                where1 = " date between ? and ?";
            }
            if (team != "") {
                where2 = " AND user_tasks.team_id = " + team;
            }
            if (task != undefined && task.length != 0) {
                where3 = " AND user_tasks.tasks_id in (" + task + ")";
            }
            if (subTask != undefined && subTask.length != 0) {
                where4 = " AND user_tasks.sub_task_id in (" + subTask + ")";
            }
            // if (taskDesc != undefined) {
            //     where5 = " AND user_tasks.task_desc = " + taskDesc;
            // }
            if (userID != undefined && userID.length != 0) {
                where6 = " AND user_tasks.user_id in (" + userID + ")";
            }
            whereN = where1 + where2 + where3 + where4 + where5 + where6;
            async.each(r, function (single, callback) {
                var secs = 0;
                var count = 0;
                var wu = 0;
                var TotalHours = 0;

                db.query("SELECT user_tasks.time , user_tasks.count, user_tasks.wu , amz_tasks.task_name AS task_name FROM user_tasks INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id where " + whereN + " AND user_tasks.tasks_id = ? and wu_status = 1", [d1, d2, single.task_id], function (error, results, fields) {
                    if (error) {
                        queryError.push(error);
                    } else {
                        if (results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                            }
                            for (var j = 0; j < results.length; j++) {
                                count = count + results[j].count;
                            }
                            for (var k = 0; k < results.length; k++) {
                                wu = wu + results[k].wu;
                            }
                            wu = Number(wu).toFixed(2);
                            TotalHours = secondsToHms(secs);
                            var diffHour = secondsToAvg(secs);
                            var avgWu = Number(wu / diffHour).toFixed(2);

                            taskData.push({
                                "total": TotalHours,
                                "workunit": wu,
                                "Count": count,
                                "AverageWorkUnit": avgWu,
                                "TaskName": single.task_name,
                            });
                        }
                        // else {
                        //     var TotalHours = 0;
                        //     res.json({
                        //         total: TotalHours
                        //     });
                        // }
                    }
                    callback();
                });



            }, function (response) {
                if (queryError.length > 0) {
                    res.send(queryError);
                } else {
                    res.send(taskData);
                }
            });
        }
    });

});


router.post('/subtask', function (req, res, next) {
    var where1, where2, where3, where4, where5, where6, whereN;
    where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";

    var d1 = moment(req.body.From).format('YYYY-MM-DD');
    var d2 = moment(req.body.To).format('YYYY-MM-DD');
    var team = req.body.team_id;
    var task = req.body.tasks_id;
    var subTask = req.body.sub_task_id;
    var userID = req.body.user_id;
    var taskDesc = req.body.task_desc;
    var userOT = req.body.user_ot;

    var subTaskData = [];
    var queryError = [];

    db.query('SELECT amz_sub_tasks.sub_task_id , amz_sub_tasks.team_id , amz_sub_tasks.task_id , amz_tasks.task_name , amz_sub_tasks.sub_task_name FROM amz_sub_tasks INNER JOIN amz_tasks ON amz_sub_tasks.task_id = amz_tasks.task_id where amz_sub_tasks.task_status = 1 and amz_sub_tasks.deletion = 0 and amz_sub_tasks.team_id = ? ORDER BY task_name ASC', [team], function (e, r, f) {


        if (userOT) {
            if (d1 == "" && d2 == "") {

            } else if (d1 == "" && d2 != "") {

            } else if (d1 != "" && d2 == "") {

            } else {
                where1 = " date between ? and ?";
            }
            if (team != "") {
                where2 = " AND user_tasks_ot.team_id = " + team;
            }
            if (task != undefined && task.length != 0) {
                where3 = " AND user_tasks_ot.tasks_id in (" + task + ")";
            }
            if (subTask != undefined && subTask.length != 0) {
                where4 = " AND user_tasks_ot.sub_task_id in (" + subTask + ")";
            }
            // if (taskDesc != undefined) {
            //     where5 = " AND user_tasks_ot.task_desc = " + taskDesc;
            // }
            if (userID != undefined && userID.length != 0) {
                where6 = " AND user_tasks_ot.user_id in (" + userID + ")";
            }
            whereN = where1 + where2 + where3 + where4 + where5 + where6;

            // var secs = 0;
            // var count = 0;
            // var wu = 0;

            async.each(r, function (single, callback) {

                var secs = 0;
                var count = 0;
                var wu = 0;
                var TotalHours = 0;

                db.query("SELECT user_tasks_ot.time , user_tasks_ot.count, user_tasks_ot.wu , amz_tasks.task_name AS task_name FROM user_tasks_ot INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id where " + whereN + " AND user_tasks_ot.sub_task_id = ? and wu_status = 1", [d1, d2, single.sub_task_id], function (error, results, fields) {
                    if (error) {
                        queryError.push(error);
                    } else {
                        if (results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                            }
                            for (var j = 0; j < results.length; j++) {
                                count = count + results[j].count;
                            }
                            for (var k = 0; k < results.length; k++) {
                                wu = wu + results[k].wu;
                            }
                            wu = Number(wu).toFixed(2);
                            TotalHours = secondsToHms(secs);
                            var diffHour = secondsToAvg(secs);
                            var avgWu = Number(wu / diffHour).toFixed(2);

                            subTaskData.push({
                                "total": TotalHours,
                                "workunit": wu,
                                "Count": count,
                                "AverageWorkUnit": avgWu,
                                "SubTaskName": single.sub_task_name,
                                "TaskNameOnSubTask": single.task_name
                            });

                            // res.json({
                            //     "total": TotalHours,
                            //     "workunit": wu,
                            //     "Count": count,
                            //     "AverageWorkUnit": avgWu,
                            //     "TaskName" : single.task_name,
                            // });
                        }
                        // else {
                        //     var TotalHours = 0;
                        //     res.json({
                        //         total: TotalHours
                        //     });
                        // }
                    }
                    callback();
                });
            }, function (response) {
                if (queryError.length > 0) {
                    res.send(queryError);
                } else {
                    res.send(subTaskData);
                }
            });

        } else {
            if (d1 == "" && d2 == "") {

            } else if (d1 == "" && d2 != "") {

            } else if (d1 != "" && d2 == "") {

            } else {
                where1 = " date between ? and ?";
            }
            if (team != "") {
                where2 = " AND user_tasks.team_id in (" + team + ")";
            }
            if (task != undefined && task.length != 0) {
                where3 = " AND user_tasks.tasks_id in (" + task + ")";
            }
            if (subTask != undefined && subTask.length != 0) {
                where4 = " AND user_tasks.sub_task_id in (" + subTask + ")";
            }
            // if (taskDesc != undefined) {
            //     where5 = " AND user_tasks.task_desc = " + taskDesc;
            // }
            if (userID != undefined && userID.length != 0) {
                where6 = " AND user_tasks.user_id in (" + userID + ")";
            }
            whereN = where1 + where2 + where3 + where4 + where5 + where6;
            async.each(r, function (single, callback) {

                var secs = 0;
                var count = 0;
                var wu = 0;
                var TotalHours = 0;

                db.query("SELECT user_tasks.time , user_tasks.count, user_tasks.wu , amz_tasks.task_name AS task_name FROM user_tasks INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id  where " + whereN + " AND user_tasks.sub_task_id = ? and wu_status = 1", [d1, d2, single.sub_task_id], function (error, results, fields) {
                    if (error) {
                        queryError.push(error);
                    } else {
                        if (results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                            }
                            for (var j = 0; j < results.length; j++) {
                                count = count + results[j].count;
                            }
                            for (var k = 0; k < results.length; k++) {
                                wu = wu + results[k].wu;
                            }
                            wu = Number(wu).toFixed(2);
                            TotalHours = secondsToHms(secs);
                            var diffHour = secondsToAvg(secs);
                            var avgWu = Number(wu / diffHour).toFixed(2);

                            subTaskData.push({
                                "total": TotalHours,
                                "workunit": wu,
                                "Count": count,
                                "AverageWorkUnit": avgWu,
                                "SubTaskName": single.sub_task_name,
                                "TaskNameOnSubTask": single.task_name
                            });
                        }
                        // else {
                        //     var TotalHours = 0;
                        //     res.json({
                        //         total: TotalHours
                        //     });
                        // }
                    }
                    callback();
                });




            }, function (response) {
                if (queryError.length > 0) {
                    res.send(queryError);
                } else {
                    res.send(subTaskData);
                }
            });
        }
    });

});


router.post('/user', function (req, res, next) {
    var where1, where2, where3, where4, where5, where6, whereN;
    where1 = where2 = where3 = where4 = where5 = where6 = whereN = "";

    var d1 = moment(req.body.From).format('YYYY-MM-DD');
    var d2 = moment(req.body.To).format('YYYY-MM-DD');
    var team = req.body.team_id;
    var task = req.body.tasks_id;
    var subTask = req.body.sub_task_id;
    var userID = req.body.user_id;
    var taskDesc = req.body.task_desc;
    var userOT = req.body.user_ot;

    var userData = [];
    var queryError = [];

    db.query('select amz_user_info.s_no, amz_user_info.user_id , amz_login.user_name , amz_user_info.team_id  from amz_user_info inner join amz_login on amz_user_info.user_id = amz_login.user_id where amz_user_info.team_id = ? and amz_user_info.status=1', [team], function (e, r, f) {

        if (userOT) {
            if (d1 == "" && d2 == "") {

            } else if (d1 == "" && d2 != "") {

            } else if (d1 != "" && d2 == "") {

            } else {
                where1 = " date between ? and ?";
            }
            if (team != "") {
                where2 = " AND user_tasks_ot.team_id = " + team;
            }
            if (task != undefined && task.length != 0) {
                where3 = " AND user_tasks_ot.tasks_id in (" + task + ")";
            }
            if (subTask != undefined && subTask.length != 0) {
                where4 = " AND user_tasks_ot.sub_task_id in (" + subTask + ")";
            }
            // if (taskDesc != undefined) {
            //     where5 = " AND user_tasks_ot.task_desc = " + taskDesc;
            // }
            if (userID != undefined && userID.length != 0) {
                where6 = " AND user_tasks_ot.user_id in (" + userID + ")";
            }
            whereN = where1 + where2 + where3 + where4 + where5 + where6;

            // var secs = 0;
            // var count = 0;
            // var wu = 0;
            async.each(r, function (single, callback) {
                var secs = 0;
                var count = 0;
                var wu = 0;
                var TotalHours = 0;
                db.query("SELECT user_tasks_ot.time , user_tasks_ot.count, user_tasks_ot.wu , amz_tasks.task_name AS task_name FROM user_tasks_ot INNER JOIN amz_tasks ON user_tasks_ot.tasks_id = amz_tasks.task_id WHERE " + whereN + " AND user_tasks_ot.user_id = ? and (task_name NOT LIKE '%Absence') and wu_status = 1", [d1, d2, single.user_id], function (error, results, fields) {
                    if (error) {
                        queryError.push(error);
                    } else {
                        if (results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                            }
                            for (var j = 0; j < results.length; j++) {
                                count = count + results[j].count;
                            }
                            for (var k = 0; k < results.length; k++) {
                                wu = wu + results[k].wu;
                            }
                            wu = Number(wu).toFixed(3);
                            TotalHours = secondsToHms(secs);
                            var diffHour = secondsToAvg(secs);
                            var avgWu = Number(wu / diffHour).toFixed(2);

                            userData.push({
                                "total": TotalHours,
                                "workunit": wu,
                                "Count": count,
                                "AverageWorkUnit": avgWu,
                                "UserName": single.user_name,
                            });
                            // }
                            // else {
                            //     var TotalHours = 0;
                            //     res.json({
                            //         total: TotalHours
                            //     });
                        }
                    }
                    callback();
                });
            }, function (response) {
                if (queryError.length > 0) {
                    res.send(queryError);
                } else {
                    res.send(userData);
                }

            });

        } else {
            if (d1 == "" && d2 == "") {

            } else if (d1 == "" && d2 != "") {

            } else if (d1 != "" && d2 == "") {

            } else {
                where1 = " date between ? and ?";
            }
            if (team != "") {
                where2 = " AND user_tasks.team_id = " + team;
            }
            if (task != undefined && task.length != 0) {
                where3 = " AND user_tasks.tasks_id in (" + task + ")";
            }
            if (subTask != undefined && subTask.length != 0) {
                where4 = " AND user_tasks.sub_task_id in (" + subTask + ")";
            }
            // if (taskDesc != undefined) {
            //     where5 = " AND user_tasks.task_desc = " + taskDesc;
            // }
            if (userID != undefined && userID.length != 0) {
                where6 = " AND user_tasks.user_id in (" + userID + ")";
            }
            whereN = where1 + where2 + where3 + where4 + where5 + where6;
            async.each(r, function (single, callback) {
                var secs = 0;
                var count = 0;
                var wu = 0;
                var TotalHours = 0;

                db.query("SELECT user_tasks.time , user_tasks.count, user_tasks.wu , amz_tasks.task_name AS task_name FROM user_tasks INNER JOIN amz_tasks ON user_tasks.tasks_id = amz_tasks.task_id  where " + whereN + " AND user_tasks.user_id = ? and (task_name NOT LIKE '%Absence') and wu_status = 1 ", [d1, d2, single.user_id], function (error, results, fields) {
                    if (error) {
                        queryError.push(error);
                    } else {
                        if (results.length > 0) {

                            for (var i = 0; i < results.length; i++) {
                                secs = secs + nodestrtotime(results[i].time) - nodestrtotime('00:00:00');
                            }
                            for (var j = 0; j < results.length; j++) {
                                count = count + results[j].count;
                            }
                            for (var k = 0; k < results.length; k++) {
                                wu = wu + results[k].wu;
                            }

                            wu = Number(wu).toFixed(2);
                            TotalHours = secondsToHms(secs);
                            var diffHour = secondsToAvg(secs);
                            var avgWu = Number(wu / diffHour).toFixed(2);
                            userData.push({
                                "total": TotalHours,
                                "workunit": wu,
                                "Count": count,
                                "AverageWorkUnit": avgWu,
                                "UserName": single.user_name,
                            });
                        }
                    }
                    callback();
                });

            }, function (response) {
                if (queryError.length > 0) {
                    res.send(queryError);
                } else {
                    res.send(userData);
                }
            });
        }

    });
});

module.exports = router;