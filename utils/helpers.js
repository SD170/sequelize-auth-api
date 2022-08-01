const generateUId = (len) => {
	return Array(len).fill(0).map(x => Math.random().toString(36).charAt(2)).join('')
};

module.exports = { generateUId };
