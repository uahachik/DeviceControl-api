import { Project } from "ts-morph";
import fs from "fs";

// Initialize the TypeScript project with your tsconfig.json
const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

// Load the Prisma client type definitions
const sourceFile = project.addSourceFileAtPath("node_modules/.prisma/client/index.d.ts");

// Read the source file text
const fileText = sourceFile.getText();

// Search for the type alias manually
const typeAliasRegex = /export\s+type\s+UserCreateInput\s*=\s*{([^}]*)}/;
const match = fileText.match(typeAliasRegex);

if (match) {
  const propertiesText = match[1];
  console.log('property_LOG', propertiesText);

  // Split properties and format
  const properties = propertiesText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('//') && !line.includes('Input'))
    .map(line => {
      const [property] = line.split(':').map(part => {
        return part.endsWith('?') ? part.replace('?', '').trim() : part.trim();
      });
      // console.log('line_LOG', part.endsWith('?'));
      let formattedProperty = '';

      if (property) {
        if (property === 'password') {
          formattedProperty = `    ${property}: String(hashPass)`;
        } else {
          formattedProperty = `    ${property}`;
        }
      }

      return formattedProperty;
    });

  // Generate the `prisma.user.create` call
  const createCall = `
import { FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';

export interface IUser {
  Params: {
    userId: string;
  };
  Body: Prisma.UserCreateInput;
}

// type User = {
//   Params: {
//       userId: string;
//   };
//   Body: { ${propertiesText} };
// }

export const signup = async (request: FastifyRequest<IUser>, reply: FastifyReply) => {
  try {
    const { email, password, firstName, lastName, profile } = request.body;

    const existingUser = await request.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.exceptions.conflict('SIGNUP USER ERROR', { cause: 'User already exists' });
    }

    const hashPass = await hashPassword(password);

    const user = await request.prisma.user.create({
      data: {
        ${properties.join(',\n')}
      }
    });

    Reflect.deleteProperty(user, 'password');

    return reply.status(201).send({ user });
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when registering a user');
  };
};
  `;

  // Output the generated call
  console.log("Generated Prisma calls:");
  console.log(createCall);

  // Optionally, write the generated call to a file
  fs.writeFileSync("src/libs/generatedPrismaCalls.ts", createCall, { encoding: "utf8" });
} else {
  console.error("Type alias 'UserCreateInput' not found.");
}


// // Output the generated call
// console.log("Generated Prisma calls:");
// console.log(createCall);


// // List all type aliases in the Prisma client type definitions
// const typeAliases = sourceFile.getTypeAliases().map(alias => alias.getName());
// console.log("Available type aliases:", typeAliases);

// // Find the type alias for `Prisma.UserCreateInput`
// const userCreateInput = sourceFile.getTypeAliasOrThrow("UserCreateInput");

// // Get the properties of the type
// const type = userCreateInput.getType();

// // Check if a property is optional
// const isOptional = (prop: any) => {
//   return prop.getFlags().includes("Optional");
// };

// const properties = type.getProperties();

