document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('contactSearch');
    const resetBtn = document.getElementById('resetFilter');
    const statusText = document.getElementById('statusText');
    const azLetters = document.querySelectorAll('#azBar span');
    const contactCards = document.querySelectorAll('.contact-card');

    document.querySelectorAll('.card-top').forEach(cardTop => {
        cardTop.addEventListener('click', (e) => {
            if (e.target.closest('.star-btn')) return;
            const card = cardTop.closest('.contact-card');
            const dropBtn = card.querySelector('.drop-btn');
            card.classList.toggle('open');
            if (dropBtn) {
                dropBtn.textContent = card.classList.contains('open') ? '▴' : '▾';
            }
        });
    });

        function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            for (const cookie of document.cookie.split(';')) {
                const trimmed = cookie.trim();
                if (trimmed.startsWith(name + '=')) {
                    cookieValue = decodeURIComponent(trimmed.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    document.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const contactId = btn.getAttribute('data-id');
            if (!contactId) return;

            const response = await fetch(`/toggle-pin/${contactId}/`, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                },
            });

            if (response.ok) {
                const data = await response.json();
                btn.classList.toggle('active', data.is_pinned);
                window.location.reload();
            }
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

    const modalOverlay = document.getElementById('contactModalOverlay');
    const openAddModalBtn = document.getElementById('openAddModal');
    const menuAddCharBtn = document.getElementById('menuAddCharBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addCharRowBtn = document.getElementById('addCharRowBtn');
    const charRowsContainer = document.getElementById('charRowsContainer');

    function addCharacteristicRow() {
        const row = document.createElement('div');
        row.className = 'char-row';
        row.innerHTML = `
            <input type="text" name="custom_label[]" placeholder="Characteristic (e.g. Role)" required>
            <input type="text" name="custom_value[]" placeholder="Value (e.g. Manager)" required>
            <button type="button" class="char-remove">✕</button>
        `;
        row.querySelector('.char-remove').addEventListener('click', () => row.remove());
        charRowsContainer.appendChild(row);
    }

    function openContactModal(withCharRow = false) {
        if (!modalOverlay) return;
        modalOverlay.classList.add('active');
        if (withCharRow && charRowsContainer.children.length === 0) {
            addCharacteristicRow();
        }
    }

    function closeContactModal() {
        if (modalOverlay) modalOverlay.classList.remove('active');
    }

    if (openAddModalBtn) openAddModalBtn.addEventListener('click', () => openContactModal(false));
    if (menuAddCharBtn) menuAddCharBtn.addEventListener('click', () => openContactModal(true));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeContactModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeContactModal);
    if (addCharRowBtn) addCharRowBtn.addEventListener('click', addCharacteristicRow);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeContactModal();
        });
    }
});
