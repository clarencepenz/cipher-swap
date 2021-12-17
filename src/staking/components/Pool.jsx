/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
	Box,
	Flex,
	Center,
	Stack,
	VStack,
	Badge,
	Text,
	Tooltip,
	Divider,
	CircularProgress,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

import StakingModal from "./StakingModal";

const PoolOverlay = ({ children }) => (
	<Center
		className="loader"
		pos="absolute"
		top={0}
		left={0}
		right={0}
		bottom={0}
		bg="whiteAlpha.900"
	>
		{children}
	</Center>
);

export const Loader = ({ color = "blue.300" }) => (
	<PoolOverlay>
		<CircularProgress isIndeterminate color={color} />
	</PoolOverlay>
);

const NotConnected = () => (
	<PoolOverlay>
		<Text color="gray.800">Not Connected</Text>
	</PoolOverlay>
);

const apyDescription = "APY is the return over your total staked amount";

const Pool = ({
	contract,
	isLoading,
	isStaking,
	isUnavailable,
	onRefetch,
	balance,
	// balanceInUSD,
	tokenBalance,
	rewardEarned,
	stakeLimit,
	stakeDuration,
	APY,
	ttm,
	ttem,
}) => (
	<Box
		bg="#000"
		color='#fff'
		my={4}
		p={4}
		borderRadius="md"
		boxShadow="md"
		pos="relative"
		overflow="hidden"
	>
		{isUnavailable ? <NotConnected /> : isLoading ? <Loader /> : null}
		<Stack direction="row">
			<Badge colorScheme="purple">New</Badge>
			{isStaking && <Badge colorScheme="green">Staking</Badge>}
		</Stack>
		<Flex
			justify="space-between"
			align="flex-start"
			className="pool-content"
			py={2}
		>
			<Flex>
				<Text fontSize={["xl", "3xl", "3xl"]} color="gray.500">
					{parseFloat(balance).toLocaleString()} YARL
				</Text>
				{/* <Text ml={2} fontSize={["xl", "3xl", "3xl"]} color="gray.200">
					{balanceInUSD}
				</Text> */}
			</Flex>
			<Text fontSize={["lg", "2xl"]} color="gray.300">
				{APY} APY
				<Tooltip label={apyDescription}>
					<InfoIcon mb={1} ml={2} />
				</Tooltip>
			</Text>
		</Flex>
		<Divider />
		<Flex
			color="gray.500"
			justify="space-around"
			wrap="wrap"
			my={2}
			className="pool-extra-info"
		>
			<VStack px={4} py={2}>
				<Text color="gray.700">Pool Balance</Text>
				<Text>{tokenBalance}</Text>
			</VStack>
			<VStack px={4} py={2}>
				<Text color="gray.700">Reward Earned</Text>
				<Text>{rewardEarned}</Text>
			</VStack>
			<VStack px={4} py={2}>
				<Text color="gray.700">Stake duration</Text>
				<Text>{stakeDuration}</Text>
			</VStack>
			<VStack px={4} py={2}>
				<Text color="gray.700">Stake Limit</Text>
				<Text>{stakeLimit}</Text>
			</VStack>
			<VStack px={4} py={2}>
				<Text color="gray.700">Early Maturity Date</Text>
				<Text>{ttem}</Text>
			</VStack>
			<VStack px={4} py={2}>
				<Text color="gray.700">Maturity Date</Text>
				<Text>{ttm}</Text>
			</VStack>
		</Flex>
		<Flex justify="flex-end">
			<StakingModal
				contract={contract}
				isStaking={isStaking}
				isTriggerDisabled={isUnavailable}
				onRefetch={onRefetch}
			/>
		</Flex>
	</Box>
);

export default Pool;
