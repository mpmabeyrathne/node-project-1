import type {
    NextFunction,
    Request,
    Response,
  } from "express";
  
  import { z } from "zod";
  
  type RequestValidationData = {
    body?: unknown;
    params?: unknown;
    query?: unknown;
  };
  
  export function validate(
    schema: z.ZodType<RequestValidationData>,
  ) {
    return (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const result = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
  
      if (!result.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.issues,
        });
      }
  
      if (result.data.body !== undefined) {
        req.body = result.data.body;
      }
  
      next();
    };
  }