class InternalError extends Error{

    constructor(message, type){
        super();
        this.message = message;
        this.type = type;
    }

    static get Types() {
        return {
            UserError: "UserError",
            ServiceError: "ServiceError"
        }
    }
}

module.exports = InternalError;