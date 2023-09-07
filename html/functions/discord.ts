export async function onRequestGet({ request, env }) {
	const id = new URL(request.url).searchParams.get("id");
	const { username, avatar } = await fetch(`https://discord.com/api/v9/users/${id}`, {
		headers: { Authorization: `Bot ${env.DISCORD_TOKEN}`, },
	}).then((r) => r.json()).catch(console.error);
	if (username == undefined) {
		return new Response(JSON.stringify({
			username: "User not found.",
			avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
		}), {
			headers: { "content-type": "application/json;charset=UTF-8", },
		});
	} else {
		return new Response(JSON.stringify({
			username: username,
			avatar_url: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
		}), {
			headers: { "content-type": "application/json;charset=UTF-8", },
		});
	}
}
