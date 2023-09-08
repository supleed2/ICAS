export async function onRequestPost({ request, env }) {
	const origin = new URL(request.url).origin;
	const { username, password, discordID } = Object.fromEntries(await request.formData().then((f) => f.entries()));

	const login = await fetch("https://eactivities.union.ic.ac.uk/user/login", {
		method: "POST",
		body: JSON.stringify({ username: username, password: password, }),
		headers: { "content-type": "application/json", },
	}).catch(console.error);

	if (login == undefined || login.status != 200) {
		console.log(`😢 Login verification failed for discord user [${discordID}] with shortcode [${username}]`);
		return Response.redirect(`${origin}/verify/failure`, 301);
	} else {
		console.log(`🚀 Login verification succeeded for discord user [${discordID}] with shortcode [${username}]`);
		// TODO: Send username and discordID to Nanobot
		return Response.redirect(`${origin}/verify/success`, 301);
	}
}
