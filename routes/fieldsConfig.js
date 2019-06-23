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

const EXPERENCE_FIELDS = {
  title: null,
  company: null,
  location: null,
  from: null,
  to: null,
  current: null,
  description: null
}

module.exports = {
  GERNERL_FIELDS,
  SOCIAL_FIELDS,
  EXPERENCE_FIELDS
}
