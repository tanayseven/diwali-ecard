import kaplay, {GameObj, TextComp} from "kaplay"
import "kaplay/global"

const k = kaplay({
	background: [0, 0, 0],
})

type States = "ready" | "initial" | "input-from" | "input-to"

const queryParams = new URLSearchParams(window.location.search)

const fetchNameFromUrl = (): string => {
	try {
		const rawName = queryParams.get("name")
		if (rawName) {
			return  atob(queryParams.get("name"))
		}
	} catch (e) {
		return  ""
	}
	return ""
};

let decodedName: string = fetchNameFromUrl();


let state: States = "initial"

if (decodedName) {
	state = "ready"
}

let name = decodedName || "!"

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

if (state === "ready") {
	greeting = newGreeting(name)
}

let inputBox: GameObj
let inputPrompt: string = ""
let inputText: string = ""
let inputTextObj: GameObj

const getCursor = () => cursorShow ? "|" : " "

const updateInputText = () => {
	if (inputTextObj) {
		k.destroy(inputTextObj)
	}
	if (inputBox) {
		k.destroy(inputBox)
	}
	inputBox = add([
		rect(width() - 200, 120, { radius: 32 }),
		anchor("center"),
		pos(center().x, height() / 2),
		outline(4),
	]);
	inputTextObj = k.add([
		text(`${inputPrompt}: ${inputText} ${getCursor()}`, {
			font: "monospace",
			size: 24,
			width: inputBox.width,
			align: "center",
		}),
		k.anchor("center"),
		k.pos(inputBox.pos),
		k.color(0, 0, 0),
	]);
}

let cursorShow = true
setInterval(() => {
	cursorShow = !cursorShow
	updateInputText()
}, 500)

if (state === "initial") {
	inputPrompt = "Enter your name"
	state = "input-from"
	updateInputText()
}

if (state === "input-from") {
	inputPrompt = "Enter your name"
	updateInputText()
}

const acceptInputTo = () => {
	state = "input-to"
	inputText = ""
	inputPrompt = "Enter recipient's name"
	updateInputText()
}

if (state === "input-to") {
	inputPrompt = "Enter recipient's name"
	updateInputText()
}

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

let isShiftPressed = false

onKeyDown("shift", () => {
	isShiftPressed = true
})

onKeyRelease("shift", () => {
	isShiftPressed = false
})

onKeyPressRepeat("backspace", () => {
	inputText = inputText.substring(0, inputText.length - 1);
	updateInputText()
});

onKeyPress("enter", () => {
	if (state === "input-to") {
		acceptInputTo()
	}
})

onCharInput((ch: string) => {
	ch = isShiftPressed ? ch.toUpperCase() : ch.toLowerCase()
	inputText += ch;
	updateInputText()
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
