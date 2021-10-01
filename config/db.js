const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect('mongodb+srv://philiplgelinas:Shudokan2030@cluster0.o2mv1.mongodb.net/Cluster0?retryWrites=true&w=majority').then(() => console.log('MongoDB Connected')).catch(err => console.log(err));