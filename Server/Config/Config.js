var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
    test: {
        root: rootPath,
        app: { name: 'Todos' },
        port: 3000,
        db: 'mongodb://127.0.0.1/todo-test',
        secret: "crazyasselectionyear"

    },

    development: {
        root: rootPath,
        app: { name: 'Todos'  },
        port: 5000,
        db: 'mongodb://127.0.0.1/todo-dev',
        secret: "TheOnlyChoiceisJohnsonweld"
        
    },
    production: {
        root: rootPath,
        app: { name: 'Todos' },
        port: 80,
        db: 'mongodb://127.0.0.1/todo',
        secret: "ThenAgainYouCanAlwaysVoteClintonOrTrump..."
    }
};



module.exports = config[env];
