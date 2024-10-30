import kaplay, {GameObj, TextComp} from "kaplay"
import "kaplay/global"

const k = kaplay({
	background: [0, 0, 0],
})

const queryParams = new URLSearchParams(window.location.search)

let decodedName: string;
try {
	decodedName = atob(queryParams.get("name"))
}
catch (e) {
	decodedName = ""
}


let name = decodedName || "<Enter name>"

let greeting: TextComp
let greetingObject: GameObj

const newGreeting = (name: string) => text(`Happy Diwali ${toTitleCase(name)}`, {
	font: "monospace",
	size: k.width() / 20,
	transform: (idx, ch) => ({
		color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
		pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
		scale: wave(1, 1.2, time() * 3 + idx),
		angle: wave(-9, 9, time() * 3 + idx),
	}),
})

greeting = newGreeting(name)

function toTitleCase(str: string): string {
	return str.replace(
		/\w\S*/g,
		text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);
}

const updateGreeting = () => {
	if (greetingObject) {
		k.destroy(greetingObject)
	}
	greeting = newGreeting(name)
	greetingObject = k.add([
		greeting,
		k.pos(k.width() / 2 - greeting.width / 2, k.height() / 2 - greeting.height / 2),
	])
	window.history.replaceState(null, null, `?name=${btoa(name)}`);
}

onKeyPressRepeat("backspace", () => {
	name = name.substring(0, name.length - 1);
	updateGreeting()
});

onCharInput((ch) => {
	name += ch;
	updateGreeting()
});

k.loadSprite("diya-1", "sprites/diya-1.png", {
	sliceX: 4,
	anims: {
		idle: {
			from: 0,
			to: 3,
			speed: 5,
			loop: true,
		},
	},
});

const diyaScale = 5;

const diyaDimensions = [(k.width() / 70) * 7, 200]

let diyaLocations = []

for (let x = 0; x < k.width(); x += diyaDimensions[0]) {
	const y = 10
	diyaLocations.push([x, y])
}

for (let x = 0; x < k.width(); x += diyaDimensions[0]) {
	const y = k.height() - diyaDimensions[1]
	diyaLocations.push([x, y])
}

diyaLocations.map(
	([x, y]) => k.add([
		k.pos(x, y),
		k.sprite("diya-1", {anim: "idle"}),
		k.scale(diyaScale),
	])
)

greetingObject = k.add([
	greeting,
	k.pos(k.width() / 2 - greeting.width / 2, k.height() / 2 - greeting.height / 2),
])
