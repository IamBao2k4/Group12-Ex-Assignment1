import { 
    DEFAULT_STUDENT_EMAIL_DOMAIN, 
    VIETNAM_PHONE_REGEX, 
    DEFAULT_COUNTRY, 
    STATUS_TRANSITIONS 
} from './constants';

export default () => {
    const environment = process.env.NODE_ENV || 'development';

    return {
        mongodb: {
            uri: environment === 'production'
                ? process.env.MONGO_URI_PROD || 'mongodb://localhost:27017/University_prod'
                : process.env.MONGO_URI_DEV || 'mongodb://localhost:27017/University'
        },
        validation: {
            email: {
                allowedDomains: process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || [DEFAULT_STUDENT_EMAIL_DOMAIN],
            },
            phoneNumber: {
                regex: process.env.PHONE_NUMBER_REGEX || VIETNAM_PHONE_REGEX,
                country: process.env.PHONE_COUNTRY || DEFAULT_COUNTRY
            },
            studentStatus: {
                allowedTransitions: STATUS_TRANSITIONS
            }
        }
    };
}; 