export const checkUserAuthenticated = () =>{
    const userToken = localStorage.getItem('token');
    console.log(userToken)

    return !!userToken;
}