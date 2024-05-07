import EErrors from "./enum.js";

const generateProductErrorInfo = (data, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            title: string ${typeof data.title}
            description: string ${typeof data.description}
            price: number ${typeof data.price}
            code: string ${typeof data.code}
            stock: number ${typeof data.stock}
            category: string ${typeof data.category}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
    }
    return errorMessage;
}

const generateCartErrorInfo = (cart, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            products: mongoose.Types.ObjectId ${typeof cart.products}
            quantity: number ${typeof cart.quantity}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
    }
    return errorMessage;
}

const generateSessionErrorInfo = (session, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            userId: mongoose.Types.ObjectId ${typeof session.userId}
            token: string ${typeof session.token}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
    }
    return errorMessage;
}

const generateUserErrorInfo = (session, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            userId: mongoose.Types.ObjectId ${typeof session.userId}
            token: string ${typeof session.token}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
    }
    return errorMessage;
}

const generateOrderErrorInfo = (order, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            code: string ${typeof order.code}
            purchase_datetime: string ${typeof order.purchase_datetime}
            amount: number ${typeof order.amount}
            purchaser: string ${typeof order.purchaser}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
    }
    return errorMessage;
}

const generateUserCartErrorInfo = (user, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            email: string ${typeof user.email}
            cartId: string ${typeof user.cartId}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
    }
    return errorMessage;
}

const generateAuthErrorInfo = (user, errorType) => {
    let errorMessage = "";
    switch (errorType) {
        case EErrors.INVALID_TYPES_ERROR:
            errorMessage = `One or more fields have invalid types:
            List of required types:
            email: string ${typeof user.email}
            cartId: string ${typeof user.cartId}
            `;
            break;
        case EErrors.DATABASE_ERROR:
            errorMessage = `Error accessing the database`;
            break;
        case EErrors.ROUTING_ERROR:
        default:
            errorMessage = `Error in routing`;
            break;
        case EErrors.AUTH_ERROR:
            errorMessage = `Error in authentication`;
            break;
    }
    return errorMessage;
}

export { generateProductErrorInfo, generateCartErrorInfo, generateSessionErrorInfo, generateOrderErrorInfo, generateUserCartErrorInfo, generateAuthErrorInfo };
