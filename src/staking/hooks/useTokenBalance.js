import { useState, useEffect, useCallback } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
// import { useAuthContext } from "../contexts/AuthProvider";
import { useTokenContractContext } from "../contexts/TokenContractProvider";
import { useConversionContext } from "../contexts/ConversionProvider";
import { getTokenBalance } from "../utils";

export default function useTokenBalance() {
	// const { authData } = useAuthContext();
	const { tokenToUSD } = useConversionContext();
	const { contract: tokenContract } = useTokenContractContext();
	const { account } = useActiveWeb3React();

	const [tokenAmount, setTokenAmount] = useState(0);
	const [tokenAmountInUsd, setTokenAmountInUsd] = useState(0);

	const fetchBalance = useCallback(async () => {
		const amount = await getTokenBalance(tokenContract, account); 
		const usdAmount = tokenToUSD(amount);
		setTokenAmount(parseFloat(amount).toFixed(2));
		setTokenAmountInUsd(usdAmount);
	}, [account, tokenToUSD, tokenContract]);

	useEffect(fetchBalance, [fetchBalance]);

	return { tokenAmount, tokenAmountInUsd };
}
