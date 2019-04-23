const joi = require('joi');
var ObjectId = require('mongoose').Types.ObjectId;

function ValidationError(arr) {
    this.name = 'ValidationError';
    this.message = '';
    this.errors = arr;
    this.stack = (new Error()).stack;
}
ValidationError.prototype = new Error();

const validator = {
    schema: (schema, data) => {
        return (req, res, next) => {
            let model = null;
            if (data)
                model = joi.validate(data, schema, { abortEarly: false });
            else
                model = joi.validate(req.body, schema, { abortEarly: false });

            if (model.error) {
                throw new ValidationError(model.error.details);
            }
            else {
                res.locals.model = model.value;
                if (!data)
                    return next();
            }
        };
    },
    throw: (...err) => {
        throw new ValidationError(err.map(x => { return { message: x }; }));
    },
    validateId: (req, res, next) => {
        if (req.params.id && !ObjectId.isValid(req.params.id))
            return validator.throw('invalid id');

        next();
    },
    errorHandler: (err, req, res, next) => {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                type: 'ValidationError',
                errors: err.errors,
                valid: false
            });
        }

        return next(err);
    }
};
module.exports = validator;