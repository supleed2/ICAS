export async function onRequestPost({ request, env }) {
	let { username, password, discordID } = Object.fromEntries(await request.formData().then((f) => f.entries()));

	let login = await fetch("https://eactivities.union.ic.ac.uk/user/login", {
		method: "POST",
		body: JSON.stringify({ username: username, password: password, }),
		headers: { "content-type": "application/json", },
	}).catch(console.error);

	if (login == undefined || login.status != 200) {
		console.log(`Login verification failed 😢 for discord user [${discordID}] with shortcode [${username}]`);
		return Response.redirect("http://127.0.0.1:8788/verify/failure", 301);
	} else {
		console.log(`Login verification succeeded 🚀 for discord user [${discordID}] with shortcode [${username}]`);
		return Response.redirect("http://127.0.0.1:8788/verify/success", 301);
	}
}
