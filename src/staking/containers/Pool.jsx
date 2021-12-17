/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect, useCallback } from "react";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { format } from "date-fns";

import Pool from "../components/Pool";

// import { useAuthContext } from "../contexts/AuthProvider";
import useStakingContract from "../hooks/useStakingContract";
import { getReadableBigNumber, addMillisecondsAndFormat } from "../utils";

// So far this component is a bit messy, but it encapsulates all the
// functionality staking should have i.e. approving, staking and claiming besides
// all information about the pool in particular.
// onUpdateTotalStaked is the function used to inject the total amount in the application header
// (or anywhere else)
export default function PoolContainer({ pool, onUpdateTotalStaked }) {
	// const { authData } = useAuthContext();
	const { account } = useActiveWeb3React()

	// const { tokenToUSD } = useConversionContext();

	// I'm using context for the Token Contract because it's
	// going to be reused throughout the entire app. As opposed to
	// staking contracts, where each pool is going to have
	// it's own contract.
	const poolContract = useStakingContract(pool.address);

	const [loading, setLoading] = useState(true);

	const [state, setState] = useState({
		tokenBalance: 0,
		poolBalance: 0,
		poolDepositTime: 0,
		rewardEarned: 0,
		totalDeposits: 0,
		stakeLimit: 0
	});

	const getAddressPoolDetails = useCallback(async () => {
		if (!poolContract || !account) return;

		setLoading(true);

		try {
			const result = await poolContract.users(account);

			setState((prev) => ({
				...prev,
				poolBalance: getReadableBigNumber(result.poolBal),
				poolDepositTime: result.pool_deposit_time * 1000,
				rewardEarned: getReadableBigNumber(result.rewardEarned),
				totalDeposits: getReadableBigNumber(result.total_deposits),
			}));
		} catch (error) {
			// console.log({ error });
		} finally {
			setLoading(false);
		}
	}, [poolContract, account]);

	const getTokenBalance = useCallback(async () => {
		if (!poolContract || !account) return;

		try {
			const result = await poolContract.tokenBalance();
			setState((prev) => ({
				...prev,
				tokenBalance: parseFloat(result.toString()),
			}));
		} catch (error) {
			// console.log({ error });
		}
	}, [poolContract, account]);

	const getStakeLimit = useCallback(async () => {
		if (!poolContract || !account) return;

		try {
			const result = await poolContract.stakeLimit();
			setState((prev) => ({
				...prev,
				stakeLimit: parseFloat(result.toString()),
			}));
		} catch (error) {
			// console.log({ error });
		}
	}, [poolContract, account]);

	useEffect(() => {
		getAddressPoolDetails();
	}, [getAddressPoolDetails]);

	useEffect(() => {
		getTokenBalance();
	}, [getTokenBalance]);

	useEffect(() => {
		getStakeLimit();
	}, [getStakeLimit]);

	const {
		tokenBalance,
		poolBalance,
		poolDepositTime,
		rewardEarned,
		totalDeposits,
		stakeLimit
	} = state;

	const isLoggedIn = Boolean(account); 
	const isUnavailable = !isLoggedIn;
	const isStaking = poolBalance > 0;

	const ttem = poolDepositTime
		? format(
			pool.earlyMaturity.durationInMilliseconds + poolDepositTime,
			"dd/MM/yyyy, HH:mm:ss"
		)
		: "--";
	const ttm = poolDepositTime
		? format(
			pool.maturity.durationInMilliseconds + poolDepositTime,
			"dd/MM/yyyy, HH:mm:ss"
		)
		: "--";

	const stakeDuration = addMillisecondsAndFormat(
		pool.maturity.durationInMilliseconds
	);

	// const poolBalanceInUSD = useMemo(
	// 	() => currencify(tokenToUSD(poolBalance)),
	// 	[tokenToUSD, poolBalance]
	// );

	useEffect(() => {
		onUpdateTotalStaked(poolBalance.toFixed(2), 0);
	}, [poolBalance, onUpdateTotalStaked]);

	return (
		<Pool
			contract={poolContract}
			isLoading={loading}
			isStaking={isStaking}
			onRefetch={getAddressPoolDetails}
			stakeLimit={stakeLimit}
			stakeDuration={stakeDuration}
			isUnavailable={isUnavailable}
			ttm={ttm}
			ttem={ttem}
			APY={pool.APY}
			balance={poolBalance.toFixed(2)}
			// balanceInUSD={poolBalanceInUSD}
			tokenBalance={tokenBalance.toLocaleString()}
			rewardEarned={rewardEarned.toLocaleString()}
			totalDeposits={totalDeposits}
		/>
	);
}
