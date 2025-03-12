
import { param, query } from "express-validator";
import { AppError } from "./appError";

///////////////// VALIDATORS ////////////////////////
const numberValidator = (type: string) => {
  let validationOn = (type === 'params') ? param : query

  return (fieldName: string) => {
    return validationOn(fieldName)
      .customSanitizer(async (jobId: string) => {
        const parsedJobID = parseInt(jobId);
        if (isNaN(parsedJobID)) {
          const message = `Invalid value passed for ${fieldName}`;
          throw new AppError(400, message);
        }

        return parsedJobID;
      });
  }
}

const dateValidatorQuery = (param: string) => {
  return query(param)
    .trim()
    .isEmpty()
    .customSanitizer(async dateString => {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const message = `Invalid date passed in ${param}`;
        throw new AppError(400, message);
      }

      return date;
    });
}
const numberValidatorParam = numberValidator('params');
const numberValidatorQuery = numberValidator('query');

export {
  numberValidatorParam,
  numberValidatorQuery,
  dateValidatorQuery
}