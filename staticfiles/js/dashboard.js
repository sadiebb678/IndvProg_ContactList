document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('contactSearch');
    const resetBtn = document.getElementById('resetFilter');
    const statusText = document.getElementById('statusText');
    const azLetters = document.querySelectorAll('#azBar span');
    const contactCards = document.querySelectorAll('.contact-card');

    document.querySelectorAll('.drop-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.contact-card');
            card.classList.toggle('open');
            btn.textContent = card.classList.contains('open') ? '▴' : '▾';
        });
    });

    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        azLetters.forEach(s => s.classList.remove('active'));
        statusText.textContent = query ? `Searching for "${query}"` : 'Showing all contacts';

        contactCards.forEach(card => {
            card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
        });
    });

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusText.textContent = 'Showing all contacts';
        azLetters.forEach(s => s.classList.remove('active'));
        contactCards.forEach(card => card.style.display = '');
    });

    azLetters.forEach(letter => {
        letter.addEventListener('click', () => {
            const char = letter.textContent;
            searchInput.value = '';
            statusText.textContent = `Showing contacts starting with "${char}"`;

            azLetters.forEach(s => s.classList.remove('active'));
            letter.classList.add('active');

            contactCards.forEach(card => {
                const name = card.getAttribute('data-name') || '';
                card.style.display = name.startsWith(char.toLowerCase()) ? '' : 'none';
            });
        });
    });
});
