document.getElementById('switch')
    .addEventListener('click', (event) => {
        const classList = event.target.classList;
        classList.toggle('on');
    })