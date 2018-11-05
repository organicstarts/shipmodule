// 
// Log Helper is meant to optimize the use of console 
// logging in clean and easy to understand functions.
//

function result(result) {
    console.log(result);
}

function error(error) {
    console.log('Looks like there was a problem: \n', error);
}

export { result, error };