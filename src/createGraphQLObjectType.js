'use strict'

const { GraphQLObjectType } = require('graphql')

/**
 * Returns function which returns fields
 *
 * @param {Object} fields
 * @param {Object} acl
 * @return {Function}
 */
const allowedFields = (fields, acl) => () => {
  let allowed = {}
  if (acl === true) {
    for (let fieldName in fields) {
      allowed[fieldName] = generateField(fields[fieldName], acl)
    }
  } else if (typeof acl === 'object') {
    for (let fieldName in acl) {
      allowed[fieldName] = generateField(fields[fieldName], acl[fieldName])
    }
  }
  if (!Object.keys(allowed).length) {
    throw new Error('Fields cannot be empty')
  }
  return allowed
}

/**
 * Generate field
 *
 * @param {Object|Function} field
 * @param {Object} acl
 * @return {Object}
 */
const generateField = (field, acl) => typeof field === 'function' ? field(acl) : field

/**
 * Create GraphQLObjectType with allowed fields
 *
 * @param {Object} props
 * @param {Object} fields
 * @return {Function.<{Object}>}
 */
module.exports = (props, fields) => acl => new GraphQLObjectType(Object.assign({}, props, {fields: allowedFields(fields, acl)}))
