const devConfig = {
  MONGO_URL: 'mongodb://localhost:27017/hackathon-dev',
  JWT_SECRET: 'Vm2x?S4{k#;zbx<C',
  AUTH_TOKEN_LIFESPAN: 60,
};

const testConfig = {
  MONGO_URL: 'mongodb://localhost:27017/hackathon-test',
  JWT_SECRET: 'Vm2x?S4{k#;zbx<C',
  AUTH_TOKEN_LIFESPAN: 60,
};

const prodConfig = {
  MONGO_URL: process.env.MONGODB_URI,
  JWT_SECRET: 'Vm2x?S4{k#;zbx<C',
  AUTH_TOKEN_LIFESPAN: 60,
};

const defaultConfig = {
  PORT: process.env.PORT || 5710,
};

function envConfig(env) {
  switch (env) {
    case 'dev':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
