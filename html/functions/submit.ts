export async function onRequestPost({ request, env }) {
	const origin = new URL(request.url).origin;
	const { username, password, discordID } = Object.fromEntries(await request.formData().then((f) => f.entries()));

	const login = await fetch("https://eactivities.union.ic.ac.uk/user/login", {
		method: "POST",
		body: JSON.stringify({ username: username, password: password, }),
		headers: { accept: "text/html", "content-type": "application/json", },
	});

	if (login.ok == false) {
		console.log(`😢 FAILURE ${discordID}: ${username}`);
		return Response.redirect(`${origin}/verify/failure`, 301);
	} else {
		const ck = login.headers.getSetCookie().at(0).split(";").at(0);
		await fetch("https://eactivities.union.ic.ac.uk/details", {
			method: "GET",
			headers: { accept: "text/html", cookie: ck },
		});
		const info = await fetch("https://eactivities.union.ic.ac.uk/ajax/863/activatetabs", {
			method: "POST",
			headers: { accept: "application/xml, text/xml", cookie: ck }
		}).then(r => r.text());
		const firstname = info.match(/alias="First Name">(.*?)<\/info/)[1];
		const surname = info.match(/alias="Surname">(.*?)<\/info/)[1];
		console.log(`🚀 SUCCESS ${discordID}: ${username}, ${firstname} ${surname}`);
		const submit = await fetch(env.BOT_URL, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ id: discordID, shortcode: username, fullname: `${firstname} ${surname}`, key: env.BOT_KEY }),
		});
		if (submit.ok) {
			return Response.redirect(`${origin}/verify/success`, 301);
		} else {
			return Response.redirect(`${origin}/verify/error`, 301);
		}
	}
}
