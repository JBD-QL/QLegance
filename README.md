# QLegance
An open-source lightweight GraphQL client library for Javascript environments<br/>
Website: http://qlegance.com

# Installation
``` bash
npm install qlegance
```
# Background
[GraphQL](http://graphql.org/) is a powerful querying language that boasts a single server endpoint to aggregate multiple server requests into one. This allows large, data-driven companies such as Facebook to build features like a full-featured native News Feed. However, there is currently no framework-agnostic solution that works together with GraphQL for client-side data fetching. Qlegance solves this issue by introducing a lightweight GraphQL client library that works in any Javascript environment. Our explicit component declarations make for intuitive fast design. In addition, our library leverages the already built configuration of your GraphQL server to produce a unique api for each client. 

# How it works
QLegance can be easily integrated within any application by simply including the script in the HTML. First a custom ql-type attribute is used to define the type of data an element is holding, coinciding with the types defined in the GraphQL schema. Then the ql-field attribute is used within the component to specify which fields it should render. Using this information, QLegance creates components pre-populated with the appropriate data. Components are also instantiated with methods that query their respective Graphql fields. QLegance’s global object contains methods for each one of the defined GraphQL field methods. With Qlegance, queries and mutations can be made with less code, and results can be rendered directly onto the DOM without the need for additional Javascript.

Contributors: Joe Kim, Dhani Mayfield, Brandon Yuan
