exports.errorHandler = (error, req, res, next) => {
	console.log(error.data);
	console.log(error.message);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;

	return res.status(status).json({ message: message, data: data, status: status });
<<<<<<< HEAD
};
=======
};
>>>>>>> 0c02d5152a67b9c6629d3d97d3cdf6ffaee0b067
