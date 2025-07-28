"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            if (schema.body)
                schema.body.parse(req.body);
            if (schema.query)
                schema.query.parse(req.query);
            if (schema.params)
                schema.params.parse(req.params);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validatsiya xatoligi",
                    errors: error.errors.map((e) => ({
                        field: e.path.join("."),
                        message: e.message,
                    })),
                });
                return;
            }
            res.status(500).json({
                success: false,
                message: "Noma'lum validatsiya xatoligi",
            });
        }
    };
};
exports.validateRequest = validateRequest;
