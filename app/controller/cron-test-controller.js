const mongoose 	= require('mongoose');
const Product 	= require('../model/product');
const cron 		= require('node-cron');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create/insert multiple products to database
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.createProducts = (req, res) => {
	let productArray = ['Bacon', 'Apple', 'Fork', 'Beans'];
	productArray.map(item => createProduct(item));
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create product function
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let createProduct = (name) => {
	product = new Product();

	product.name = name;
	product.status = 'Active';
	product.description = `Sample description for product: ${name}`;

	product.save((err, products) => {
		if(err) throw err;
		console.log('Successfully added new product.');
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get list of products
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getProducts = (req, res) => {
	let query = Product.find({}).sort('dateCreated').select({'__v': 0 });
	query.exec((err, products) => {
		if(err) return res.status(500).json({
			success:false, 
				message: 'Something went wrong.', 
					error: err });

		if(!products) return res.status(404).json({
			success:false, 
				message: 'Product does not exist.' });

		res.status(200).json({
			success:true, 
				message:'Successfully fetched a list of products', 
					products: products })
	});	
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get list of products thats less than the current date
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getProductLessDate = (req, res) => {
	let currentDate = new Date();
	let query = Product.find({ dateCreated: {$lt: currentDate}}).select({ 'status':0, '__v': 0 });
	query.exec((err, products) => {
		if(err) return res.status(500).json({
			success:false, 
				message: 'Something went wrong.', 
					error: err });

		if(!products) return res.status(404).json({
			success:false, 
				message: 'Product does not exist.' });

		res.status(200).json({
			success:true, 
				message:'Successfully fetched a list of products', 
					currentDate: currentDate,
						products: products })
	});	
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update product description every 10 seconds
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.updateProductSchedule = (req, res) => {
	cron.schedule('*/10 * * * * *', function(){
		let productArray = ['Bacon', 'Apple', 'Fork', 'Beans'];
		productArray.map(product => updateProduct(product));
	});
};

let updateProduct = (name) => {
	let randomNumber = Math.floor(Math.random() * (999 - 1 + 1));
	let query = Product.findOne({name: name}).select({ 'name': 1 });
	query.exec((err, product) => {
		if(err) throw err;
		if(product){
			product.description = `Random description generate every 10 seconds: ${randomNumber}`;
			product.save(err =>{
				if(err) throw err;
				console.log(`Successfully updated random description for: ${product.name}\n ${product.description}\n`);	
			});
		}
	});
};