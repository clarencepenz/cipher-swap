/* eslint-disable react/jsx-filename-extension */
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const ConversionContext = createContext({});

export default function ConversionProvider({ children }) {
	const [table, setTable] = useState({});

	const fetchConversionTable = useCallback(async () => {
		// This function needs to be modified to fetch the conversion price
		// for other tokens besides yarl
		const response = await fetch("https://yarlooprice.mucitadel.io/");
		const jsonResponse = await response.json();
		setTable(jsonResponse);
	}, []);

	useEffect(() => {
		fetchConversionTable();
	}, [fetchConversionTable]);

	const tokenToUSD = useCallback(
		(n) => n * parseFloat(table.yarloo_price_usd || 0),
		[table]
	);

	const tokenToBNB = useCallback(
		(n) => n * parseFloat(table.yarloo_price_bnb || 0),
		[table]
	);

	const value = { tokenToUSD, tokenToBNB };

	return (
		<ConversionContext.Provider value={value}>
			{children}
		</ConversionContext.Provider>
	);
}

export function useConversionContext() {
	const context = useContext(ConversionContext);

	if (context === undefined) {
		throw new Error(
			"useConversionContext should be used inside an ConversionProvider"
		);
	}

	return context;
}
