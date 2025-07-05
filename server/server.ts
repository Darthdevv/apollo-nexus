import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v4 as uuidv4 } from "uuid";
import { gql } from "graphql-tag";

interface User {
  id: string;
  name: string;
  email: string;
}

let users: User[] = [
  { id: uuidv4(), name: "Alice", email: "Alice@gmail.com" },
  { id: uuidv4(), name: "Bob", email: "Bob@gmail.com" },
  { id: uuidv4(), name: "Charlie", email: "Charlie@gmail.com" }
];

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User!
    deleteUser(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (_: any, { id }: { id: string }) => users.find((u) => u.id === id),
  },
  Mutation: {
    createUser: (_: any, { name, email }: { name: string, email: string }) => {
      const newUser = { id: uuidv4(), name, email };
      users.push(newUser);
      return newUser;
    },
    updateUser: (
      _: any,
      { id, name, email }: { id: string, name?: string, email?: string }
    ) => {
      const user = users.find((u) => u.id === id);
      if (!user) throw new Error("User not found");
      if (name) user.name = name;
      if (email) user.email = email;
      return user;
    },
    deleteUser: (_: any, { id }: { id: string }) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, { listen: { port: 4000 } }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});




