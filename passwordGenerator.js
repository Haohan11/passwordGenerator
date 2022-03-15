
const passwordSlider = document.querySelector("#passwordSlider");
const passwordLengthInput = document.querySelector("#passwordLength");
const includeSymbolsInput = document.querySelector("#includeSymbols");
const includeNumberInput = document.querySelector("#includeNumber");
const includeLowercaseInput = document.querySelector("#includeLowercase");
const includeUppercaseInput = document.querySelector("#includeUppercase");
const generateButton = document.querySelector("#generateButton");
const copyButton = document.querySelector("#copyButton");
const passwordOutput = document.querySelector("#passwordOutput");
const useAPIInput = document.querySelector("#useAPI");

let copyable = false;

const BASE_URL = () =>
    `https://cors-anywhere.herokuapp.com/
    https://password.markei.nl/random.json?
    min=${parseInt(passwordLengthInput.value)}&
    max=${parseInt(passwordLengthInput.value)}&
    symbols=${includeSymbolsInput.checked}&
    lowercase=${includeLowercaseInput.checked}&
    uppercase=${includeUppercaseInput.checked}&
    digits=${includeNumberInput.checked}`;

const max = parseInt(passwordSlider.max);
const min = parseInt(passwordSlider.min);

passwordSlider.value = passwordLengthInput.value;

passwordSlider.oninput = e => {
    passwordLengthInput.value = e.target.value;
};

passwordLengthInput.addEventListener("change", (e) => {
    length = Math.round(e.target.value)
    length =
    length > min
        ? length < max
        ? length
        : max
        : min;
    e.target.value = length
    passwordSlider.value = length;
});

passwordLengthInput.addEventListener("keydown", e => {
    if (e.code === "Enter") passwordLengthInput.blur();
});

passwordOutput.addEventListener("focus", () => {
    handleColor('');
    copyable = true;
});

generateButton.addEventListener("click", () => {
    copyable = false;
    if (
    includeSymbolsInput.checked || includeNumberInput.checked ||
    includeLowercaseInput.checked || includeUppercaseInput.checked
    ) {
    useAPIInput.checked ? generateUseAPI() : generateOnClientSide()
    return;
    }
    handleColor('red');
    passwordOutput.value = "Select at least one character set!";
});

copyButton.addEventListener("click", () => {
    if (!copyable) return
    let text = passwordOutput.value;
    navigator.clipboard.writeText(text);
    handleColor('gray');
    passwordOutput.value = "Copied to clipboard!";
    copyable = false;
});

const handleColor = color => {
    passwordOutput.classList.remove("gray", "red");
    if(color) passwordOutput.classList.add(color);
}

const generateUseAPI = async () => {
    handleColor('gray');
    passwordOutput.value = "Loading...";
    try {
        const response = await fetch(BASE_URL());
        const data = await response.json();
        const password = data.passwords[0];
        handleColor('');
        passwordOutput.value = password;
        copyable = true;
    } catch {
        handleColor('red');
        passwordOutput.value = "Failed to get password!";
    }
}

const uppercaseCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercaseCharacters = 'abcdefghijklmnopqrstuvwxyz'
const symbols = '~`!@#$%^&*()_-+={[}]|\:;"><,.?/\''

const generateOnClientSide = () => {
    let password = ''
    let enableSet = []
    if (includeSymbolsInput.checked) enableSet.push(symbols)
    if (includeNumberInput.checked) enableSet.push('')
    if (includeLowercaseInput.checked) enableSet.push(lowercaseCharacters)
    if (includeUppercaseInput.checked) enableSet.push(uppercaseCharacters)
    for(let i = 0; i < passwordLengthInput.value - enableSet.length; i ++){
    password += 
        generateChar(enableSet[Math.floor(getRandom() *enableSet.length)])
    }
    for(let i = 0; i < enableSet.length; i ++){
    const slicePoint = getRandom() *(password.length + 1)
    const char = generateChar(enableSet[i])
    password = 
        `${password.slice(0, slicePoint)}${char}${password.slice(slicePoint)}`
    }
    handleColor('')
    passwordOutput.value = password
    copyable = true;
}

const getRandom = () => {
    return self.crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1)
}

const generateChar = set => {
    return set ? 
    set[Math.floor(getRandom() *set.length)] : Math.floor(getRandom() *10)
}