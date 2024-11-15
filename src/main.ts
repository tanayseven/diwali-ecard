import {GameObj, TextComp} from "kaplay"
import "kaplay/global"
import {k, States} from "./game";
import {toTitleCase} from "./stringUtils";

interface GameState {
	nextScreen: () => GameState
}

class InitialScreen implements GameState {
	state: States

	constructor() {
		this.state = "initial"
	}

	nextScreen(): GameState {
		// TODO return the next screen
	}
}

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

const updateGreeting = () => {
	if (greetingObject) {
		k.destroy(greetingObject)
	}
	greeting = newGreeting(name)
	greetingObject = k.add([
		greeting,
		k.pos(k.width() / 2 - greeting.width / 2, k.height() / 2 - greeting.height / 2),
	])
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

const showCopyLinkButton = () => {
	const copyLinkButton = k.add([
		k.text("Copy link", {
			font: "monospace",
			size: 24,
		}),
		k.pos(k.width() / 2, k.height() - 100),
		k.color(0, 0, 0),
		k.area(),
		k.scale(1),
	])
}

onKeyPress("enter", () => {
	if (state === "input-from") {
		acceptInputTo()
	}
	if (state === "input-to") {
		name = inputText
		updateGreeting()
	}
	if (state === "ready") {
		showCopyLinkButton()
	}
})

onCharInput((ch: string) => {
	ch = isShiftPressed ? ch.toUpperCase() : ch.toLowerCase()
	inputText += ch;
	updateInputText()
});

greetingObject = k.add([
	greeting,
	k.pos(k.width() / 2 - greeting.width / 2, k.height() / 2 - greeting.height / 2),
])
