const  IPFS  =  require ( 'ipfs-api' ); 
 const  ipfs  =  new  IPFS ({ host : 'ipfs.infura.io' ,  port :  5001 ,  protocol :  'https' });


export const  IPFSfileAdd = async(data)=>{
const file={path:'nftapp',content:data}
const filesAdd=await ipfs.add(file)

var ipfsimage = filesAdd[0].hash;
return ipfsimage

 }



 