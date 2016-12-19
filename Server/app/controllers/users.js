var express = require('express'),
	logger = require('../../config/logger'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Todo = mongoose.model('Todo'),
	passportService = require('../../config/passport'),
	passport = require('passport'),
	router = express.Router();

var requireAuth = passport.authenticate('jwt', { session: false });



var requireLogin = passport.authenticate('local', { session: false });


module.exports = function (app) {
	app.use('/api', router);

	


	router.route('/users')

		.get(requireAuth, function (req, res, next) {
	//	.get( function (req, res, next) {
			logger.log('Get User', 'debug');
			var query = User.find()
				.sort(req.query.order)
				.exec()
				.then(function (result) {
					res.status(200).json(result);
				})
				.catch(function (err) {
					return next(err);
				});
		})

		.post( function (req, res, next) {
			logger.log('Create User', 'info');
			logger.log(req.body);
			var user = new User(req.body);
			user.save()
				.then(function (result) {
					res.status(201).json(result);
				})
				.catch(function (err) {
					return next(err);
				});
		})

		.put(requireAuth, function (req, res, next) {
			logger.log('Update User ' + req.params.id, 'verbose');
			var query = User.findOneAndUpdate(
				{ _id: req.body._id },
				req.body,
				{ new: true })
				.exec()
				.then(function (result) {
					res.status(200).json(result);
				})
				.catch(function (err) {
					return next(err);
				});
		});

	router.route('/users/:id')
		.get(requireAuth, function (req, res, next) {
			logger.log('Get User ' + req.params.id, 'verbose');
			var query = User.findById(req.params.id)
				.exec()
				.then(function (result) {
					res.status(200).json(result);
				})
				.catch(function (err) {
					return next(err);
				});
		})

		.put(requireAuth, function (req, res, next) {
			logger.log('Update User ' + req.params.id, 'verbose');
			var query = User.findById(req.params.id)
				.exec()
				.then(function (user) {
					var query = User.findById(req.params.id)
						.exec()
						.then(function (user) {
							if (req.body.firstName !== undefined) {
								user.firstName = req.body.firstName;
							}
							if (req.body.lastName !== undefined) {
								user.lastName = req.body.lastName;
							}
							if (req.body.screenName !== undefined) {
								user.screenName = req.body.screenName;
							}
							if (req.body.email !== undefined) {
								user.email = req.body.email;
							}
							if (req.body.password !== undefined) {
								user.password = req.body.password;
							}

							return user.save();
						})

						.then(function (user) {
							res.status(200).json(user);
						})
						.catch(function (err) {
							return next(err);
						});
				});
		})

		.delete(requireAuth, function (req, res, next) {
			logger.log('Delete User ' + req.params.id, 'verbose');
			var query = User.remove({ _id: req.params.id })
				.exec()
				.then(function (result) {
					res.status(204).json({ message: 'Record deleted' });
				})
				.catch(function (err) {
					return next(err);
				});
		})
		;



	router.route('/users/screenName/:name')
		.get(requireAuth, function (req, res, next) {
			logger.log('Get User ' + req.params.id, 'verbose');
			User.findOne({ screenName: req.params.name }).exec()
				.then(function (user) {
					res.status(200).json(user);
				})
				.catch(function (err) {
					return next(err);
				});
		});



router.route('/users/followedTodos/:id')

    .get(requireAuth, function (req, res, next) {
      logger.log('Get Users followed Todos ' + req.params.id, 'debug');
      User.findOne({ _id: req.params.id }, function (err, user) {
        if (!err) {
          Todo.find({
            $or: [
              { user: user._id }, { user: { $in: user.follow } }
            ]
          }).populate('todoAuthor').sort({ dateSubmitted: -1 }).exec(function (err, todos) {
            if (!err) {
              res.status(200).json(todos);
            } else {
              res.status(403).json({ message: "Forbidden" });
            }
          });
        }
      });
    });



	router.route('/users/follow/:id')

		.put(requireAuth, function (req, res, next) {
			logger.log('Update User ' + req.params.id, 'verbose');
			User.findOne({ _id: req.params.id }).exec()
				.then(function (user) {
					if (user.follow.indexOf(req.body._id) == -1) {
						user.follow.push(req.body._id);
						user.save()
							.then(function (user) {
								res.status(200).json(user);
							})
							.catch(function (err) {
								return next(err);
							});
					}
				})
				.catch(function (err) {
					return next(err);
				});
		});


	router.route('/users/login')

		.post(requireLogin, login);


};
