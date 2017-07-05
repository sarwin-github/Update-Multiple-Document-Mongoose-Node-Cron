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
	let query = Product.find({}).sort('dateCreated');

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
