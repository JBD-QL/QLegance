# QLegance
An open-source lightweight GraphQL client library for Javascript environments
# Installation
``` bash
npm install qlegance
```
# Background (GraphQL and Relay)
[GraphQL](http://graphql.org/) is a querying language developed by Facebook for the purpose of data fetching and manipulation.  The data is retrieved from the GraphQL server via queries from the client side.  Its advantage over traditional REST APIs is that it allows the user to make advanced requests with includes and excludes.

[Relay](https://facebook.github.io/relay/) is a framework that is built on top of React and provides data fetching capability to React applications.  Relay bundles the individual queries made by the React components and sends one request to the GraphQL servers.  This ensures that the components only receive the data they need (no overfetching).  Relay also updates the components when the data changes and keeps a client side cache of the data, leading to shorter querying time.

# Problem and Solution
Current solutions are tightly coupled to other frameworks.  Qlegance wants to remedy this by providing a framework agnostic version, so every javascript environment can utilize the powerful data fetching features.
