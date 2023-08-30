const text1 = "Jetstream - ";
const text2 = "wo Perfektion auf die Piste trifft";
let index1 = 0;
let index2 = 0;
let completedFirstPart = false;

const textElement1 = document.getElementById("text-part1");
const textElement2 = document.getElementById("text-part2");
const cursorElement1 = document.getElementById("cursor1");
const cursorElement2 = document.getElementById("cursor2");

function writeText() {
  if (!completedFirstPart) {
    if (index1 < text1.length) {
      textElement1.textContent += text1.charAt(index1);
      index1++;
    } else {
      completedFirstPart = true;
      // Initially fill textElement2 with spaces to "reserve" space
      textElement2.textContent = " ".repeat(text2.length);
      // Move the white cursor next to the yellow cursor
      cursorElement1.style.marginLeft = "calc(14px * " + text2.length + ")";
    }
  }

  if (completedFirstPart && index2 < text2.length) {
    // Replace the space at the corresponding position with the actual character
    let newText = textElement2.textContent.split("");
    newText[index2] = text2.charAt(index2);
    textElement2.textContent = newText.join("");

    // Move the text closer to "Jetstream" (shift to the left)
    cursorElement1.style.marginLeft =
      "calc(14px * " + (text2.length - index2 - 1) + ")";
    index2++;
  }
}

setInterval(writeText, 200);
