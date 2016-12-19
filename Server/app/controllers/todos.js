var express = require('express'),
	logger = require('../../config/logger'),
	mongoose = require('mongoose'),
	Todo = mongoose.model('Todo'),
	passportService = require('../../config/passport'),
	passport = require('passport'),
	router = express.Router();

var requireAuth = passport.authenticate('jwt', { session: false });


module.exports = function (app) {
	app.use('/api', router);  

	router.route('/todos')	

		.get(requireAuth, function (req, res, next) {
	//	.get( function (req, res, next) {
      		logger.log('Get todos', 'debug');
     		var query = Todo.find()
        		.sort(req.query.order)
        		.exec()
        		.then(function (result) {
         			res.status(200).json(result);
        		})
        		.catch(function(err){
         			return next(err);
        		});
    	})


		.post(requireAuth, function (req, res, next) {
	//	.post(function (req, res, next) {
      		logger.log('Create todo', 'info');
			  logger.log(req.body);
      		var todo = new Todo(req.body);
     		todo.save()
      			.then(function (result) {
					  
          			res.status(201).json(result);
     			})
      			.catch(function(err){
         			return next(err);
      			});
    	})

		.put(requireAuth, function (req, res, next) {
      		logger.log('Update Todo ' + req.params.id, 'verbose');
      		var query = Todo.findOneAndUpdate(
				{ _id: req.body._id }, 
				req.body, 
				{ new: true })
      			.exec()
      			.then(function (result) {
          			res.status(200).json(result);
     			})
      			.catch(function(err){
          			return next(err);
      			});
    	});

    
    router.route('/todos/:id')
		.get(requireAuth, function (req, res, next) {
      		logger.log('Get chip ' + req.params.id, 'verbose');
      		var query = Todo.findById(req.params.id)
        	.exec()
        	.then(function (result) {
         		 res.status(200).json(result);
        	})
       		.catch(function(err) {
          		return next(err);
        	});
    	})

		.delete(requireAuth, function (req, res, next) {
      		logger.log('Delete todo ' + req.params.id, 'verbose');
      		var query = Todo.remove({ _id: req.params.id })
        		.exec()
        		.then(function (result) {
          			res.status(204).json({ message: 'Record deleted' });
        		})
        		.catch(function (err) {
          			return next(err);
        		});
    		})
    ;
    router.route('/Todos/userTodos/:id')

	.get(requireAuth, function(req, res,next){
        //add some logic if there is id not found
		logger.log('Get User Todos ' + req.params.id, 'verbose');
		//Chirp.find({chirpAuthor: req.params.id})
	Todo.find({todoAuthor: req.params.id})
			.populate('todoAuthor')
			//.populate('user')
			.sort("-dateCreated")
			.exec()
			.then(function(todos){
				res.status(200).json(todos);
			})
			.catch(function(err){
				return next(err);
			});
	});

  router.route('/todos/completed/:id')
        .put(requireAuth, function(req, res, next){
                logger.log('Update Todo complete ' + req.params.id,'debug');
      	        Todo.findOne({_id: req.params.id}).exec()
		        .then(function(todo){
        			todo.completed = !todo.completed ;
      			return todo.save();
		        })
		        .then(function(todo){
			        res.status(200).json(todo);
		        })
	            .catch(function (err) {
		            return next(err);
	            });

        });
            

};
