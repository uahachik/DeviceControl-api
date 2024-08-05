import { FastifyError, FastifyReply } from 'fastify';
import { Prisma } from '@prisma/client';
import { InternalServerError } from './errors';

type PrismaErrorDefault = {
  message: string;
  code: string;
};

enum PrismaClientErrorCause {
  ValidationError = "Invalid input data",
  ConstraintViolation = "Database constraint violation",
  ConnectionError = "Database connection error",
  UniqueConstraintViolation = "Unique constraint violation",
  ForeignKeyConstraintViolation = "Foreign key constraint violation",
  TimeoutError = "Database request timeout",
  TransactionError = "Transaction failed",
  UnknownError = "Unknown database error",
  QueryError = "Query execution error"
}

function getPrismaErrorCause(code: string): string {
  switch (code) {
    case 'P2000': // Value too long for column
    case 'P2001': // Record not found
    case 'P2005': // Value invalid for column type
    case 'P2006': // Value not provided for required column
    case 'P2011': // Null constraint violation
    case 'P2012': // Missing a required value
    case 'P2013': // Missing the required argument
    case 'P2014': // Relation violation
    case 'P2015': // Related record not found
    case 'P2018': // Required records not found
    case 'P2025': // Record to delete does not exist
      return PrismaClientErrorCause.ValidationError;

    case 'P2002': // Unique constraint failed
      return PrismaClientErrorCause.UniqueConstraintViolation;

    case 'P2003': // Foreign key constraint failed
      return PrismaClientErrorCause.ForeignKeyConstraintViolation;

    case 'P2004': // Constraint violation
    case 'P2016': // Query interpretation error
    case 'P2017': // Records not connected
      return PrismaClientErrorCause.ConstraintViolation;

    case 'P2008': // Failed to connect to the database
      return PrismaClientErrorCause.ConnectionError;

    case 'P2010': // Raw query failed
      return PrismaClientErrorCause.QueryError;

    case 'P2024': // Timed out fetching a response
      return PrismaClientErrorCause.TimeoutError;

    case 'P2030': // Missing environment variable
    case 'P2031': // Error parsing connection string
    case 'P2033': // Invalid argument for SQL function
    case 'P2034': // Server error
    case 'P2035': // Client error
    case 'P2036': // Serialization error
      return PrismaClientErrorCause.QueryError;

    case 'P0001': // Generic query error
    case 'P0002': // No rows were affected
    case 'P0003': // Too many rows were affected
    case 'P0004': // Invalid input syntax
      return PrismaClientErrorCause.QueryError;

    default:
      return PrismaClientErrorCause.UnknownError;
  }
}

function getLinesOfPrismaError(error: Error) {
  const errorString = error.stack || error.toString();
  return errorString.split('\n');
}

function handleError(error: Error, reply: FastifyReply, msg: string, opts: PrismaErrorDefault) {
  const messageMatch = error.message.match(/message: "(.*?)"/);
  const codeMatch = error.message.match(/code: "(\w+)"/);
  const prismaErrorLines = getLinesOfPrismaError(error);

  const message = messageMatch ? messageMatch[1] : opts.message;
  const code = codeMatch ? codeMatch[1] : opts.code;
  const cause = `${getPrismaErrorCause(code)}`;
  const name = prismaErrorLines[0].trim().slice(0, -1);
  const stackTraceLines = prismaErrorLines.filter((line: string) => line.trim().startsWith('at'));
  const stack = stackTraceLines.join('\n');

  new InternalServerError(reply, msg, message, cause, name, code, stack);
  return reply.status(500).send({ message: 'INTERNAL SERVER ERROR', cause: 'An unexpected internal server error occurred' });
}

export default function prismaClientErrorHandler(error: FastifyError, reply: FastifyReply, msg: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    const defaultOpts = {
      message: error.message ? error.message : 'A database error occurred',
      code: 'DATABASE_ERROR',
    };
    return handleError(error, reply, msg, defaultOpts);
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    // Handle unknown Prisma errors
    const defaultOpts = {
      message: error.message ? error.message : 'An unknown database error occurred',
      code: 'UNKNOWN_ERROR',
    };
    return handleError(error, reply, msg, defaultOpts);
  } else if (error instanceof Prisma.PrismaClientRustPanicError) {
    // Handle Prisma panic errors
    const defaultOpts = {
      message: error.message ? error.message : 'A database panic occurred',
      code: 'PANIC',
    };
    return handleError(error, reply, msg, defaultOpts);
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    // Handle initialization errors
    const defaultOpts = {
      message: error.message ? error.message : 'Failed to initialize the database connection',
      code: 'INIT_ERROR',
    };
    return handleError(error, reply, msg, defaultOpts);
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    // Handle validation errors
    const defaultOpts = {
      message: error.message ? error.message : 'A validation error occurred',
      code: 'VALIDATION_ERROR',
    };
    return handleError(error, reply, msg, defaultOpts);
  }
}
