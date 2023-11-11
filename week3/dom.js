const btn1 = document.getElementById('btn1');
btn1.addEventListener('click', (event) => {
    console.log("I click button 1");
})

const btn2 = document.getElementById('btn2');
btn2.addEventListener('click', (event) => {
    console.log(`[${event.pageX}, ${event.pageY}]`);;
})

document.addEventListener("keydown", (event) => {
    console.log(`I hit Key ${event.code}`)
})

const container = document.getElementById('wrapper');
document.addEventListener("mousedown", (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const box = document.createElement('div');
    box.classList.add('box');
    box.style.left = `${event.pageX - container.offsetLeft - 25}px`;
    box.style.top = `${event.pageY - container.offsetTop - 25}px`;
    container.appendChild(box);

    // Set a timeout to remove the box after a short delay
    setTimeout(() => {
        box.style.opacity = '0';
        box.addEventListener('transitionend', () => box.remove());
    }, 1000); // Adjust time as needed
})

