const validateRating = (rating) => {
  const validatedRating = Math.min(Math.max(rating, 0), 5);
  return Math.round(validatedRating * 10) / 10;
};

module.exports = {
	validateRating
};