

export const getReceipt = async (web3, approveCall) => {
	var receipt = await web3.eth.getTransactionReceipt(approveCall)
	return receipt;
}