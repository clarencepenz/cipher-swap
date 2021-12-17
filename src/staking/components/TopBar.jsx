/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuDivider,
	MenuItem,
	Flex,
	Image,
	Button,
	useToast,
} from "@chakra-ui/react";
import { FaRegCopy, FaSignOutAlt } from "react-icons/fa";

import { useAuthContext } from "../contexts/AuthProvider";
import { copyToClipboard } from "../utils";

import Logo from "../images/elonballs_logo.png";

export function shortenAddress(address) {
	const firstPart = address.slice(0, 15);
	const secondPart = address.slice(address.length - 4, address.length);
	return [firstPart, secondPart].join("...");
}

const AccountMenu = ({ address, onAddressClick, onLogoutClick }) => (
	<Menu>
		<MenuButton colorScheme="blue" as={Button}>
			Actions
		</MenuButton>
		<MenuList>
			<MenuItem icon={<FaRegCopy />} onClick={onAddressClick}>
				{shortenAddress(address)}
			</MenuItem>
			<MenuDivider />
			<MenuItem icon={<FaSignOutAlt />} onClick={onLogoutClick}>
				Logout
			</MenuItem>
		</MenuList>
	</Menu>
);

export default function TopBar() {
	const toast = useToast();
	const { authData, logIn, logOut } = useAuthContext();

	const handleLoginButtonClick = () => {
		logIn("metamask");
	};

	const handleAddressClick = () => {
		if (authData.address) {
			copyToClipboard(authData.address);
			toast({
				title: "Copied 🎉🎉",
				description: "Address successfully copied to the clipboard",
				status: "success",
				duration: 4000,
				isClosable: true,
			});
		}
	};

	const handleLogoutButtonClick = () => {
		logOut();
	};

	const isLoggedIn = Boolean(authData.address);

	return (
		<Flex py={4} justify="space-between" align="center">
			<Image src={Logo} maxW={{ base: "60px", md: "80px" }} />
			{isLoggedIn ? (
				<AccountMenu
					address={authData.address}
					onAddressClick={handleAddressClick}
					onLogoutClick={handleLogoutButtonClick}
				/>
			) : (
				<Button colorScheme="blue" onClick={handleLoginButtonClick}>
					Connect
				</Button>
			)}
		</Flex>
	);
}
