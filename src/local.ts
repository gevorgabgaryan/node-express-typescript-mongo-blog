require('dotenv').config();

const Env = {
  listeningPort: process.env.listeningPort,
  websiteURL: process.env.websiteURL,
  website: process.env.website,
  wsPort: process.env.wsPort,
  isProd: process.env.isProd,
  langs: process.env.langs,
  roles: process.env.roles,
  statuses: process.env.statuses,
  categories: process.env.categories,
  searchFields: process.env.searchFields,
  languages: process.env.languages,
  sessionExpiration: process.env.sessionExpiration || 1 * 365 * 24 * 60 * 60,
  youadworldToken: process.env.youadworldToken

};

export default Env;
