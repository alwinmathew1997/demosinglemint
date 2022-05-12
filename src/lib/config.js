let EnvName = "demo"
// let EnvName = "local"

let toasterOption = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
  };
  
var networkversion = '80001';
var contractAddress= '0x0663D2e40dC2d31c7f8AC19A2bca2De6EEA73AAA';
let currencySymbol     = 'MATIC';
var   Back_URL  
var PrefferedNetwork 

if(EnvName==="production"){
  networkversion = '80001';
  contractAddress= '0x0663D2e40dC2d31c7f8AC19A2bca2De6EEA73AAA';
  PrefferedNetwork="Polygon"

} else if (EnvName==="demo"){
  networkversion = '80001';
  contractAddress= '0x0663D2e40dC2d31c7f8AC19A2bca2De6EEA73AAA';
  Back_URL  = 'http://localhost:2053/';
  PrefferedNetwork="Mumbai"

} else{
  networkversion = '80001';
  contractAddress= '0x0663D2e40dC2d31c7f8AC19A2bca2De6EEA73AAA';
  Back_URL  = 'http://localhost:2053/';
  PrefferedNetwork="Mumbai"
}


var key = {
    
    toasterOption: toasterOption,
    SINGLE_CONTRACT:contractAddress,
    networkVersion:networkversion,
    decimalvalues:1000000000000000000,
    ipfsurl : "https://ipfs.infura.io/ipfs/",
    currencySymbol:currencySymbol,
    Back_URL:Back_URL,
    PrefferedNetwork:PrefferedNetwork


    
  };
  
  
  export default key;