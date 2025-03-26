export default () => {
    const environment = process.env.NODE_ENV || 'development';

    return {
        mongodb: {
            uri: environment === 'production'
                ? process.env.MONGO_URI_PROD || 'mongodb://localhost:27017/University_prod'
                : process.env.MONGO_URI_DEV || 'mongodb://localhost:27017/University'
        }
    };
}; 