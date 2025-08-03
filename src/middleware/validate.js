import { matchedData } from "express-validator";
import ErrorResponse from "../utils/errorResponse.js";

const validate = (validations) => async (req, _, next) => {
  try {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        const extractedErrors = result.array().map((err) => ({
          field: err.path,
          message: err.msg,
        }));
        return next(
          new ErrorResponse("Validation Error", 400, extractedErrors)
        );
      }
    }

    const validatedData = matchedData(req, {
      onlyValidData: true,
      locations: ["body", "query"],
    });

    const requestFields = [
      ...new Set([
        ...Object.keys(req.body || {}),
        ...Object.keys(req.query || {}),
      ]),
    ];
    const allowedFields = Object.keys(validatedData);
    const extraFields = requestFields.filter(
      (key) => !allowedFields.includes(key)
    );

    if (extraFields.length > 0) {
      return next(
        new ErrorResponse(
          "Unexpected fields in request",
          400,
          extraFields.map((field) => ({
            field,
            message: `${field} is not allowed`,
          }))
        )
      );
    }

    next();
  } catch (error) {
    console.log(error, "ERROR");

    throw error;
  }
};

export default validate;
