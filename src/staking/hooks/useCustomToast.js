import { useToast } from "@chakra-ui/toast";

export default function useCustomToast() {
	const toast = useToast();

	const success = (title, message) => {
		toast({
			title: `${title} 🎉🎉`,
			description: message,
			status: "success",
			duration: 4000,
			isClosable: true,
		});
	};

	const error = (title, message) => {
		toast({
			title: `${title} ⚠️⚠️`,
			description: message,
			status: "error",
			duration: 4000,
			isClosable: true,
		});
	};

	return { success, error };
}
