# Logging Documentation for Developers

## Overview

This documentation explains the logging mechanism integrated into a Fastify application. The custom logging system is built on top of the Pino logger and is automated to log relevant information for each response sent by the server. Additionally, it provides methods for manual logging when necessary.

## Custom Logger

The application uses a custom logger "Dev Friendly" that wraps the Pino logger. This logger provides methods to log informational messages and errors in a structured manner.

## Logging Methods

### Automated Logging

The logging system is designed to automatically log details about each response sent by the server without requiring manual logging in the controller methods.

- **onSend Hook**: The `onSend` hook is used to log information automatically when a response is sent. This hook captures either the endpoint's schema description (if a schema is available) or route path, and logs the response payload.

### Manual Logging

Developers can also log messages manually using the `logInfo`, `logWarn`, and `logError` methods available on the `reply` objects. This is useful for logging additional information at specific points in the request lifecycle. Also `logError` is presented on the Fastify instance.

## How to Use Manual Logging

Manual logging can be performed using the `logInfo`, `logWarn`, and `logError` method on the `reply` objects. This method accepts a message, payload, and optional context data.

### Example Usage

```
// Inside a route handler or hook
fastify.get('/example', async (request, reply) => {
  try {
  const data = { key: 'value' };
  // Log information manually
  reply.logInfo('Example log message', data, { customOption: 'exampleOption' });
  return { success: true };
  } catch (error) {
    <!-- reply.logError -->
  }
});
```

### Method Signatures
  - reply.logInfo: Logs an informational message related to the response.
    - Signature: reply.logInfo(msg: string, data: unknown, opts?: unknown): void
- reply.logWarn: Logs an warning message related to the response that ends with an exception (400 <= statusCode < 500).
    - Signature: reply.logWarn(msg: string, warn: { message: string, cause: string, name: string, stack: string; }, opts?: unknown): void
- reply.logError: Logs an error message related to the response that ends with an error (statusCode >= 500).
    - Signature: reply.logError(message: string, error: { message: string, cause: string, name: string, stack: string; }, opts?: unknown): void
  
## Logging Format
All log messages follow a consistent format, with the message wrapped in quotes and structured data included as JSON. This ensures that logs are easy to read and parse.

## Automated Logging in Action
Here’s an outline of how automated logging works:
  1. onSend Hook Execution: Before the response is sent, the onSend hook captures the route's schema description or route path, and the response payload.
  2. Log Entry Creation: The logger creates a log entry with the message, payload, and additional context.
  3. Log Output: The log entry is outputted in a structured format using the Pino logger.


## Conclusion
The logging system is designed to handle most logging requirements automatically, ensuring that all responses are logged with relevant information. This reduces the need for manual logging and helps maintain clear and useful logs throughout the application. Additionally, developers have the flexibility to log specific messages manually using the logInfo, logWarn, and logError methods on the request and reply objects.