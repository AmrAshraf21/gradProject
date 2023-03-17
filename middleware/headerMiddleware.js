exports.setHeaders = (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET , POST, PUT ,PATCH,DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type , Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
<<<<<<< HEAD
};
=======
};
>>>>>>> 0c02d5152a67b9c6629d3d97d3cdf6ffaee0b067
