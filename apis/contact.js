import axios from "axios";

export function submitContact(body) {
	const url = "/contacts";
	return new Promise((resolve, reject) => {
		axios
			.post(url, body)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}
