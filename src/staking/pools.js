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
	new StakingPool(DAYS_IN_MINUTES[7], 0.05, true, {
        development: "0xD4d1F48c2CF25C0C8b06937EEC75c27EDC050A38",
        production: "0xE826448bf2f5772b8CC327c12dFc9CB1d5B65692",
    }),
    new StakingPool(DAYS_IN_MINUTES[30], 0.3, true, {
        development: "0xD4d1F48c2CF25C0C8b06937EEC75c27EDC050A38",
        production: "0xb7ce32ed4D2bD47ce951c2141fE16C351D60226e",
    }),
    new StakingPool(DAYS_IN_MINUTES[90], 0.45, true, {
        development: "0xF3f896901cfd1358dAF12975Dd750517bc607Af7",
        production: "0x38325956905280A626D50c07a5e9642930cdfA33",
    }),
    new StakingPool(DAYS_IN_MINUTES[180], 0.65, true, {
        development: "0x1317F6a807B05D4262206cc8350493B6D9Ad3D61",
        production: "0x619f07316E352378b48Ca8934224e536ae752297",
    }),
    new StakingPool(DAYS_IN_MINUTES[360], 0.85, true, {
        development: "0xA6527d3984BAE125b3b969E96aB1955C74907cC9",
        production: "0x72678CDbECf223140C8141A1A9519379f57cb699",
    }),
];

export default stakingPools;
