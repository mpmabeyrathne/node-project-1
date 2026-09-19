import type {
    ErrorRequestHandler,
  } from "express";
  
  import { AppError } from "../errors/app-error.js";
  
  export const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
  ) => {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        message: error.message,
      });
  
      return;
    }
  
    console.error(error);
  
    res.status(500).json({
      message: "Internal server error",
    });
  };