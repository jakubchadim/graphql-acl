# GraphQL ACL

Specify allowed fields for roles. Create big scheme with all fields and allow only some fields to roles.

## Installation:

Using npm:
```bash
$ npm i --save graphql-acl
```

## Example:

#### ACL:
Configure object representing allowed fields.
```javascript
const acl = {
  user: true,
  articles: {
    title: true,
    author: {
      name: true
    }
  }
}
```
#### Scheme:
```graphql
{
  user: {
    name: String,
    surname: String,
    email: String
  },
  articles: {
    id: Number,
    title: String,
    perex: String,
    content: String,
    views: Number,
    author: {
      name: String,
      surname: String
    }
  }
}
```
#### Result:
Generated schema contains only allowed fields.
```graphql
{
  user: {
    name: String,
    surname: String,
    email: String
  },
  articles: {
    title: String,
    author: {
      name: String
    }
  }
}
```

## Implementation:

##### createGraphQLObjectType(props, fields) => function (acl)
Return function which expect acl as param and generate GraphQLObjectType.

`props` - {Object} - GraphQLObjectType properties
`fields` - {Object} - expect GQL object or function which returns GQL object

##### index.js
```javascript
const { GraphQLSchema } = require('graphql')

const {ROLES, ACL} = require('./acl')
const createRoot = require('./root')

const userSchema = new GraphQLSchema({
  description: 'User graphGL',
  query: createRoot(ACL[ROLES.USER])
})

const adminSchema = new GraphQLSchema({
  description: 'Admin graphGL',
  query: createRoot(ACL[ROLES.ADMIN])
})
```


##### root.js
```javascript
const { GraphQLString } = require('graphql')
const { createGraphQLObjectType } = require('graphql-acl')

const createUser = require('./user')

const user = acl => ({
  description: 'Steam nickname',
  type: createUser(acl)
})

const version = ({
  description: 'Version',
  type: GraphQLString
})

const createRoot = createGraphQLObjectType({
  name: 'Query'
}, {
  user,
  version
})

module.exports = createRoot
```

##### user.js
```javascript
const { GraphQLString } = require('graphql')
const { createGraphQLObjectType } = require('graphql-acl')

const name = ({
  description: 'Name',
  type: GraphQLString
})

const surname = ({
  description: 'Surname',
  type: GraphQLString
})

const createUser = createGraphQLObjectType({
  name: 'User'
}, {
  name,
  surname
})

module.exports = createUser
```

##### acl.js
```javascript
const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
}

const userAcl = {
  user: {
    name: true
  }
}

const ACL = {
  [ROLES.USER]: userAcl,
  [ROLES.ADMIN]: true // Allow everything
}

module.exports = {
  ROLES,
  ACL
}
```
