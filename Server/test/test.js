var mongoose = require("mongoose"),
	User = require('../app/models/user'),
	Chirp = require('../app/models/chirp');

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
	beforeEach((done) => {
		User.remove({}, (err) => {
			done();
		});

	});

	//tests /api/users - GET- Get all users
	it('it should GET all the users', (done) => {
		chai.request(server)
			.get('/api/users')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
	});

	//tests /api/users - Post - Create a user
	it('it should POST a user', (done) => {
		var user = {
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "one@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		};
		chai.request(server)
			.post('/api/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('firstName');
				res.body.firstName.should.be.a('string');
				res.body.firstName.should.equal('Jane');
				done();
			});
	});

	//tests /api/users - Post - should NOT create a user w/o email address
	it('it should not POST a user without email field', (done) => {
		var user = {
			"firstName": "Jane",
			"lastName": "Doe",
			"screenName": "JoJo",
			"password": "pass"
		};
		chai.request(server)
			.post('/api/users')
			.send(user)
			.end((err, res) => {
				res.should.have.status(500);
				done();
			});
	});

	//tests /api/users/:ID - GET - Gets a user by ID
	it('it should GET a user by the given id', (done) => {
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "five@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});

		user.save((err, user) => {

			chai.request(server)
				.get('/api/users/' + user._id)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.should.have.property('screenName');
					res.body.should.have.property('_id').eql(user._id.toString());
					done();
				});
		});

	});

	//tests /api/users - Put - Update a user
	it('it should UPDATE a user', (done) => {

		//Define a valid user document as before with an email other than wooathoo.com and name o
		//than Joey
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "five@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});

		user.save((err, user) => {
			chai.request(server)
				.put('/api/users/')
				.send({
					"_id": user._id,
					"firstName": "Jane",
					"lastName": "Doe",
					"email": "woo@hoo.com",
					"screenName": "Joey",
					"password": "pass"
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('email').eql('woo@hoo.com');
					res.body.should.have.property('screenName').eql('Joey');
					done();
				});
		});
	});

	// tests /api/users/screenname/:NAME - Get - Get a user based on screenname
	it('it should GET a user give the screenName', (done) => {

		//Define a valid user document as before
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "five@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});

		user.save((err, user) => {
			chai.request(server)
				.get('/api/users/screenName/' + user.screenName)
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('firstName');
					res.body.should.have.property('lastName');
					res.body.should.have.property('email');
					res.body.should.have.property('screenName');
					res.body.should.have.property('_id').eql(user._id.toString());
					done();
				});
		});
	});

	//tests /api/users/:ID - DELETE - Deletes a user by ID
	it('it should DELETE a user given the id', (done) => {
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "five@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
		user.save((err, user) => {
			chai.request(server)
				.delete('/api/users/' + user.id)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});

	//tests /api/users/follow/:ID - PUT - Follows a user
	it('it should UPDATE a users follow array', (done) => {

		//Define a valid user document as before
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "five@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});

		user.save((err, user) => {
			chai.request(server)
				.put('/api/users/follow/' + user._id)
				.send({
					"_id": "5804ec7fdde8d3035c9bfbcb"
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('follow');
					res.body.follow.should.be.a('array');
					res.body.follow.length.should.be.eql(1);
					done();
				});
		});
	});

});


describe('User', () => {
	beforeEach((done) => { //Before each test we empty the database
		User.remove({}, (err) => {
			var user = new User({
				"firstName": "Sally",
				"lastName": "Jones",
				"email": "SallyJones@hoo.com",
				"screenName": "SoSo",
				"password": "pass"
			});

			user.save((err, user) => {
				USER_ID = user._id;
				var chirp = Chirp({
					"chirp": "This is a chirp",
					"chirpAuthor": USER_ID
				});

				chirp.save((err, chirp) => {
					done();
				});

			});
		});

	});


	//tests /api/users/FollowedChirps/:ID - GET - Get the chirps of the users a user follows
	it('it should GET a users followed chirps', (done) => {
		var user = new User({
			"firstName": "Jane",
			"lastName": "Doe",
			"email": "eight@hoo.com",
			"screenName": "JoJo",
			"password": "pass"
		});
		user.save((err, user) => {
			var NEW_USER_ID = user._id;

			var chirp = Chirp({
				"chirp": "This is another chirp",
				"chirpAuthor": user._id
			});
			chirp.save((err, chirp) => {
				chai.request(server)
					.put('/api/users/follow/' + NEW_USER_ID)
					.send({ "_id": USER_ID })
					.end((err, res) => {
						chai.request(server)
							.get('/api/users/followedChirps/' + NEW_USER_ID)
							.send(user)
							.end((err, res) => {
								res.should.have.status(200);
								res.body.should.be.a('array');
								res.body.length.should.be.eql(2);
								res.body[0].should.have.property('chirp');
								res.body[0].chirp.should.be.a('string');
								res.body[0].chirp.should.equal('This is another chirp');
								res.body[1].chirp.should.equal('This is a chirp');
								done();
							});
					});
			});
		});
	});
});

describe('Chirp', () => {
	beforeEach((done) => {
		Chirp.remove({}, (err) => {
			done();
		});

	});
	//tests /api/chirps - GET- Get all chirps
	it('it should GET all the chirps', (done) => {
		chai.request(server)
			.get('/api/chirps')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body.length.should.be.eql(0);
				done();
			});
	});

	//tests /api/chirps - Post - Create a chirp
	it('it should POST a chirp', (done) => {


		var chirp = {
			"chirp": "This is another chirp",
			"chirpAuthor": "5804ec7fdde8d3035c9bfbcb"
		};
		chai.request(server)
			.post('/api/chirps')
			.send(chirp)
			.end((err, res) => {
				res.should.have.status(201);
				res.body.should.have.property('chirp');
				res.body.chirp.should.be.a('string');
				res.body.chirp.should.equal('This is another chirp');
				done();
			});
	});

	//tests /api/chirps - Put - Update a chirp
	it('it should UPDATE a chirp', (done) => {

		//Define a valid user document as before with an email other than wooathoo.com and name o
		//than Joey
		var chirp = new Chirp({
			"chirp": "This is another chirp",
			"chirpAuthor": "5804ec7fdde8d3035c9bfbcb"
		});

		chirp.save((err, user) => {
			chai.request(server)
				.put('/api/chirps/')
				.send({
					"_id": chirp._id,
					"chirp": "This is another chirp REDO"
				})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('chirp').eql('This is another chirp REDO');
					done();
				});
		});
	});

	//tests /api/chirps/:ID - GET - Gets a chirp by ID
	it('it should GET a chirp by the given id', (done) => {
		var chirp = new Chirp({
			"chirp": "This is yet another chirp",
			"chirpAuthor": "5804ec7fdde8d3035c9bfbcb"
		});

		chirp.save((err, user) => {

			chai.request(server)
				.get('/api/chirps/' + chirp._id)
				.send(chirp)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('chirp');
					res.body.should.have.property('chirp').eql('This is yet another chirp');
					res.body.should.have.property('_id').eql(chirp._id.toString());
					done();
				});
		});

	});

	//tests /api/chirps/:ID - DELETE - Deletes a chirp by ID
	it('it should DELETE a chirp given the id', (done) => {
		var chirp = new Chirp({
			"chirp": "This is yet another chirp",
			"chirpAuthor": "5804ec7fdde8d3035c9bfbcb"
		});
		chirp.save((err, chirp) => {
			chai.request(server)
				.delete('/api/chirps/' + chirp.id)
				.end((err, res) => {
					res.should.have.status(204);
					done();
				});
		});
	});

	//tests /api/chirps/userchirps/:ID - GET - Gets a users chirps
	it('it should Get a chirp given the author id', (done) => {
		var chirp = new Chirp({
			"chirp": "This is yet another chirp",
			"chirpAuthor": "5804ec7fdde8d3035c9bfbcb"
		});
		chirp.save((err, chirp) => {
			chai.request(server)
				.get('/api/chirps/userChirps/5804ec7fdde8d3035c9bfbcb')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.length.should.be.eql(1);
					done();
				});
		});

	});

	//tests /api/chirps/like/:ID - PUT - Like a chirp
	it('it should ADD a like to a chirp by id', (done) => {
		var chirp = new Chirp({
			"chirp": "This is yet another chirp",
			"chirpAuthor": "5804ec7fdde8d3035c9bfbcb"
		});
		chirp.save((err, chirp) => {
			chai.request(server)
				.put('/api/chirps/like/' + chirp.id)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('likes').eql(1);
					done();
				});
		});

	});



});