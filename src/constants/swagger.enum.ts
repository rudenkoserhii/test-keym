export const SWAGGER = {
    AUTH: {
        CONTROLLER: {
            TAGS: 'Authorisation',
            OPERATION_SIGN_UP: 'Sign Up for user',
            OPERATION_LOG_IN: 'Log In for user',
            OPERATION_FORGOT: 'User forgot a password',
            OPERATION_LOG_OUT: 'LogOut for user',
        }
    },
    BOOKINGS:
    {
        CONTROLLER: {
            TAGS: 'Bookings',
            GET_ALL: 'Get all bookings',
            GET_ALONE: 'Get booking by id',
            CREATE: 'Create booking',
            UPDATE: 'Update booking',
            DELETE: 'Delete booking',
        }
    },
    USER: {
        CONTROLLER:{
            TAGS: 'User',
            UPDATE: 'Update user',
            GET_USER: 'Get current user',
        }
    }
}