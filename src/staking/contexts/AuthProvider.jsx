/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-filename-extension */
import React,
 { createContext, useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";

// const stringToBool = (str) => str === "true";

/*
The model that I want is the following:
We have multiple authentication methods, so I would like to have a simple `authentication_method` cookie.
This would say `metamask`, `poltergeist`, etc., for example.
If the user is not authenticated, then `authentication_method` is "none".
This component would then ask the respective extension for information.
If information is retrieved successfully
  - it would ask the API for information related to that address.
Else if the request to the extension is not successful (the user clicks Cancel, for example)
  - it would change `authentication_method` to "none".
The user will then have to log in again (simple, painless process)
---
Whenever there is an address, it would request related information to the API. This information would then
be passed to child elements as a prop, maybe something called `authenticationInformation`.
Ideally, they will later on be able to add more addresses under their username? Anyway, NFTs will be tied
to one address, not to an account. Information is retrieved easily from the database in connection to any
address the user has associated.
*/

// const log = (v) => (console.log(v), v);

async function logInWithMetamask(before, after) {
	const {ethereum} = window.ethereum;
	try {
		before();
		await ethereum.request({ method: "eth_requestAccounts" });
		const addy = await ethereum.request({ method: "eth_accounts" });
		after();
		// console.log({ addy });
		return addy;
	} catch (e) {
		// Metamask error. Null means "error, reload window and try again".
		// console.log("breach of construct");
		return null;
	}
}

function setLogOutState(setAuthData) {
	const logOut = () => {
		setAuthData({
			address: undefined,
			authenticationMethod: "none",
			role: "guest",
		});
		const cookies = new Cookies();
		cookies.set("authentication_method", "none");
	};
	return logOut;
}

function setLogInState(setAuthData) {
	return async function logIn(newMethod = "metamask") {
		const cookies = new Cookies();
		const cookiedMethod = cookies.get("authentication_method");
		if (newMethod === "metamask" || cookiedMethod === "metamask") {
			// if (newMethod === "metamask")
			// cookies.set("authentication_method", "metamask");
			const before = () => {
				// console.log("trying to log in");
				cookies.set("authentication_method", "none");
			};
			const after = () => {
				// console.log("logged in successfully");
				cookies.set("authentication_method", "metamask");
			};
			const adminList = [
				"0x450e501C21dF2E72B4aE98343746b0654430dC16", // dred
				"0xAd9b97fa8f28daCa6731d116d6fD2C72A164Ae0b", // jetso
				"0xA541e31A2AA1d9717b64786d3C7b2406AF89C952", // eyad
			].map((x) => x.toLowerCase());
			return logInWithMetamask(before, after)
				.then((addresses) => {
					const address = addresses[0]?.toLowerCase();
					const isAdmin = adminList.includes(address);
					const role = isAdmin ? "admin" : "user";
					if (address !== null) {
						setAuthData({
							address,
							authenticationMethod: "metamask",
							role,
						});
						// Later on, we can put more API-retrieved user info here for all essential details.
						// However, I don't know if this renders with every page, which would make us
						// delay each page load by loading user info instead of making it persist.
						// One solution is to store an address-encrypted user info localStorage element
						// and every time the user loads a page, we get the addy from metamask, and then
						// we get the information right from localStorage which will make things faster.
						return true;
					} else {
						cookies.set("authentication_method", "metamask");
						window.location.reload();
						// setAuthData({ address: undefined, authenticationMethod: "none" });
					}
				})
				.catch(console.error);
		}
	};
}

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
	// connectMetaMask();
	// We need to pass something like authenticationData which contains the address.
	// We need to make logOut() modify this authenticationData.
	// We need to retrieve this modifiable authenticationData and then pass it to the children again.
	// Maybe it can be done with a `const [authData, setAuthData] = useState({})`
	const [authData, setAuthData] = useState({ address: undefined });
	const [hasMetamask, setHasMetamask] = useState(false);

	useEffect(() => {
		if (window.ethereum) setHasMetamask(true);
		else setHasMetamask(false);
	}, []);

	const logIn = setLogInState(setAuthData);
	const logOut = setLogOutState(setAuthData);

	const cookie = new Cookies();

	const authMethod = cookie.get("authentication_method");

	if (authMethod === "metamask" && hasMetamask && !authData.address) {
		try {
			// console.log("logging in");
			logIn("metamask");
		} catch (e) {
			// console.log("logged out");
			logOut();
		}
	}

	const value = {
		authData,
		logIn,
		logOut,
		hasMetamask,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error("useAuthContext should be used inside an AuthProvider");
	}

	return context;
}
