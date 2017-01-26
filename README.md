# QLegance
A lightweight GraphQL client library for Javascript environments
# Installation
``` bash
npm install qlegance
```
# Background (GraphQL and Relay)
[GraphQL](http://graphql.org/) is a querying language developed by Facebook for the purpose of data fetching and manipulation.  The data is retrieved from the GraphQL server via queries from the client side.  Its advantage over traditional REST APIs is that it allows the user to make advanced requests with includes and excludes.

[Relay](https://facebook.github.io/relay/) is a framework that is built on top of React and provides data fetching capability to React applications.  Relay bundles the individual queries made by the React components and sends one request to the GraphQL servers.  This ensures that the components only receive the data they need (no overfetching).  Relay also updates the components when the data changes and keeps a client side cache of the data, leading to shorter querying time.

# Problem and Solution
Unfortunately, Relay is tightly dependent on React and can't be used with other frameworks.  Qlegance wants to remedy this by providing a framework agnostic version of Relay, allowing other popular frameworks like Angular to utilize the powerful data fetching features.

# How it Works
To use QLegance, the user simply needs set up their GraphQL server and define the related schemas.  For example:
``` bash
const UserQL = new GraphQLObjectType({
  name: 'UserQL',
  fields: () => ({
    username: {type: new GraphQLNonNull(GraphQLString)},
    alt: {type: new GraphQLNonNull(GraphQLString)},
    password: {type: new GraphQLNonNull(GraphQLString)}
  })
});
```
And the related query and mutation schemas:
``` bash
const Query = new GraphQLObjectType({
  name: 'RootQueries',
  fields: () => ({
    allUsers: {
      ...
    }
});

const Mutation = new GraphQLObjectType({
  name: 'MutationQL',
  fields: {
    create: {
      ...
    }
  }
});
```

Then, to query data from the database, the user simply needs to type:
``` bash
Template: QLegance.field_name({ parameters }, [ what they want ])

Example: QLegance.create({ username: "Joe", alt: "Kim", password: "password" }, ['username', 'alt', 'passsword'])
```
