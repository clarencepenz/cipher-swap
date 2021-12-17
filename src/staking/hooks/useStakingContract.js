import { useState, useEffect } from "react";
import { useTokenContractContext } from "../contexts/TokenContractProvider";
import { createStakingContract } from "../utils";

export default function useStakingContract(address) {
	const { contract: tokenContract } = useTokenContractContext();
	const [contract, setContract] = useState(null);

	useEffect(() => {
		if (!tokenContract) return;
		const newContract = createStakingContract(address, tokenContract.signer);
		setContract(newContract);
	}, [tokenContract, address]);

	return contract;
}
