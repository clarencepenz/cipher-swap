/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Box } from "@chakra-ui/react";
import useActiveWeb3React from 'hooks/useActiveWeb3React';

import PoolContainer from "../containers/Pool";

// import { useAuthContext } from "../contexts/AuthProvider";

import pools from "../pools";

const Gradient = () => (
	<Box
	pos="absolute"
	top={0}
	right={0}
	bottom={0}
	left={0}
	bgGradient="linear(to-b, transparent 5%, whiteAlpha.900 40%)"
	zIndex={3}
	/>
	);
	
	export default function PoolList({ onUpdateTotalStaked }) {
	const { account } = useActiveWeb3React()
	// const { authData } = useAuthContext();
	const isLoggedIn = Boolean(account);
	return (
		<Box id="pools" my={12} pos="relative">
			{!isLoggedIn && <Gradient />}
			{pools.map((pool) => (
				<PoolContainer
					key={pool.APY}
					pool={pool}
					isLoggedIn={isLoggedIn}
					onUpdateTotalStaked={onUpdateTotalStaked}
				/>
			))}
		</Box>
	);
}
