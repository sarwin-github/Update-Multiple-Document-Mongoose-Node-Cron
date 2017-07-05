const mongoose 	= require('mongoose');
const Product 	= require('../model/product');
const cron 		= require('node-cron');

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Create/insert multiple products to database
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.createProducts = (req, res) => {
	let productArray = ['Coke', 'Spoon', 'Cake', 'Coffee'];
	productArray.map(item => createProduct(item));
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
					products: products });
	});	
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Get list of products thats less than the current date
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.getProductLessDate = (req, res) => {
	let currentDate = new Date('2017-07-05T06:47:20.725Z');
	let query = Product.find({ dateCreated: {$lt: currentDate}}).select({ '__v': 0 });
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
						products: products });
	});	
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update product description every 10 seconds
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports.updateProductSchedule = (req, res) => {
	let currentDate = new Date('2017-07-05T06:47:20.725Z');
	cron.schedule('*/10 * * * * *', function(){
		updateProduct(currentDate, (err, product) => {
			if(err) throw err;
			console.log(`\nSuccessfully updated products created before ${currentDate}`);
		});
	});
};

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Update product function
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
let updateProduct = (currentDate, callback) => {
	let randomNumber = Math.floor(Math.random() * (999 - 1 + 1));
  	let description = `Random description: ${randomNumber}`;
  	let query = Product.update({ dateCreated: { $lt: currentDate }}, { status: 'Inactive' }, { multi: true });

  	query.exec((err, product) => {
      	if(err){
      		callback(err, null);
      	} else {
      		callback(null);
      	}
  	});
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

