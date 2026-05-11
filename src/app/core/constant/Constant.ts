export const GlobalConstant = {
    LOCAL_LOGIN_KEY:'farmerLoginData',
    TOKEN_KEY:'fareme_token',
    API_ENDPOINTS:{
        LOGIN:'farmerUsers/login',
        GET_USER_BY_ID:'getUserbyId?id=',
        GET_ALL_USERS:'farmerUsers/get-all-users',
        GET_ALL_ROLES:'farmerRoles/get-all-roles',
        CREATE_ROLE:'farmerRoles/create-role',
        UPDATE_ROLE:'farmerRoles/update-role/',
        CREATE_USER:'farmerUsers/create-user',
        GET_CATEGORY: 'farmerCategories/get-all-categories',
        CREATE_CATEGORY:'farmerCategories/create-category',
        UPDATE_CATEGORY:'farmerCategories/update-category/',
        
        GET_ALL_FARMER_PRODUCTS_BY_CAT:'farmerFarmerProducts/getFarmerProductByCateId?categoryId=',
        GET_ALL_PRODUCTS:'farmerFarmerProducts/get-all-farmer-products-with-joins',
        GET_ALL_PRODUCTS_BY_FARMER:'farmerFarmerProducts/get-farmer-products-by-farmer/',
        CREATE_PRODUCT:'farmerFarmerProducts/create-farmer-product',
        UPDATE_PRODUCT:'farmerFarmerProducts/update-product/',
        DELETE_PRODUCT:'farmerFarmerProducts/delete-product/',
        GET_ALL_PRODUCT_MASTERS:'farmerProducts/get-all-products-with-joins',
        CREATE_PRODUCT_MASTER:'farmerProducts/create-product',
        UPDATE_PRODUCT_MASTER:'farmerProducts/update-product/',
        DELETE_PRODUCT_MASTER:'farmerProducts/delete-product/',
        FILTER_PRODUCTS:'farmerFarmerProducts/filter-farmer-products',
        ADD_TO_CART:'farmerCart/add-to-cart',
        GET_CART_BY_CUST:'farmerCart/get-cart-by-customer-with-joins/',
        DELETE_CART_BY_ID:'farmerCart/delete-cart/',

        ORDER_SAVE:'farmerOrders/create-order',
        GET_ORDER_BY_CUSTOMER:'farmerOrders/get-order-by-customer-id/',
        GET_ORDER_BY_FGARMER:'farmerOrders/get-order-by-farmer-id/',
        GET_ORDER_BY_ORDER_ID:'farmerOrders/get-order-by-order-id/'
     

 
 


    },
    VALIDATION_MESSAGE: {
        REQUIRED:'This is Required',
        MOBILE_NO:'Max and Min 10 Char Needed'
    }
}
