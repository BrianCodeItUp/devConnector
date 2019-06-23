const GERNERL_FIELDS = {
  company: null,
  website: null,
  location: null,
  status: null,
  bio: null,
  githubusername: null,
  skills: {
    type: 'array',
    funcName: 'splitByComma'
  }
}

const SOCIAL_FIELDS = {
  youtube: null,
  twitter: null,
  facebook: null,
  linkedin: null,
  instagram: null
}

module.exports = {
  GERNERL_FIELDS,
  SOCIAL_FIELDS
}
