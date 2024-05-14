
const ErrorSet = {}

ErrorSet.generateError = (req, res, next) => {
  try {
    
    throw new Error('This Error is an intentional Error');
  } catch (error) {
    next(error);
  }
  
};

module.exports = ErrorSet 
