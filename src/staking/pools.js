const isDevelopment = process.env.REACT_APP_HOST_ENV === "development";

class StakingPool {
	constructor(durationInMinutes, rewards, availableInProduction, addresses) {
		this.APY = `${parseInt(rewards * 100)}%`;
		this.maturity = {
			rewardsPercentage: rewards,
			durationInMilliseconds: durationInMinutes * 60 * 1000,
		};
		this.earlyMaturity = {
			rewardsPercentage: rewards / 2,
			durationInMilliseconds: (durationInMinutes / 2) * 60 * 1000,
		};
		this.address = isDevelopment ? addresses.development : addresses.production;
		this.availableInProduction = availableInProduction;
	}
}

const DAYS_IN_MINUTES = {
	2: 2880,
	7: 10080,
	30: 43200,
	90: 129600,
	180: 259200,
	360: 518400,
};

const stakingPools = [
	new StakingPool(DAYS_IN_MINUTES[2], 1, true, {
		development: "0x549783f77a7BF20B0D8d060cE4fEB17187f12FE7",
		production: "0x278d7A2022F05E0Db5d4Ac153B8120B4D4d19F92",
	}),
];

export default stakingPools;
