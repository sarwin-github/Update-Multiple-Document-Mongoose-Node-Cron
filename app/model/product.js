const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const productSchema = mongoose.Schema({
	name 			: 	String,
    description     : 	String,
    status		  	: 	String,
    dateCreated 	: 	{ type: Date, default: Date.now }, // 
});

module.exports = mongoose.model( 'Product', productSchema );