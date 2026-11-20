document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('contactSearch');
    const resetBtn = document.getElementById('resetFilter');
    const statusText = document.getElementById('statusText');
    const azLetters = document.querySelectorAll('#azBar span');
    const contactList = document.getElementById('contactList');

    const modalOverlay = document.getElementById('contactModalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const contactForm = document.getElementById('contactForm');
    const modalPinCheckbox = document.getElementById('modalPinCheckbox');
    const openAddModalBtn = document.getElementById('openAddModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const addCharRowBtn = document.getElementById('addCharRowBtn');
    const charRowsContainer = document.getElementById('charRowsContainer');

    const newCharModal = document.getElementById('newCharModal');
    const menuAddCharBtn = document.getElementById('menuAddCharBtn');
    const closeNewCharBtn = document.getElementById('closeNewCharBtn');
    const cancelNewCharBtn = document.getElementById('cancelNewCharBtn');

    const manageCharModal = document.getElementById('manageCharModal');
    const menuEditCharBtn = document.getElementById('menuEditCharBtn');
    const closeManageCharBtn = document.getElementById('closeManageCharBtn');

    const filterDisplayModal = document.getElementById('filterDisplayModal');
    const menuFilterBtn = document.getElementById('menuFilterBtn');
    const closeFilterModalBtn = document.getElementById('closeFilterModalBtn');
    const cancelFilterModalBtn = document.getElementById('cancelFilterModalBtn');
    const saveDisplayPrefsBtn = document.getElementById('saveDisplayPrefsBtn');
    const defaultSortSelect = document.getElementById('defaultSortSelect');
    const defaultViewSelect = document.getElementById('defaultViewSelect');
    const compactModeCheckbox = document.getElementById('compactModeCheckbox');
    const avatarPicker = document.getElementById("avatarFilePicker");
    const avatarDataInput = document.getElementById("avatarDataInput");

        if (avatarPicker && avatarDataInput) {
        avatarPicker.addEventListener("change", function () {
            const file = avatarPicker.files[0];
            if (!file) return;

            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement("canvas");
                canvas.width = 120;
                canvas.height = 120;
                canvas.getContext("2d").drawImage(img, 0, 0, 120, 120);
                avatarDataInput.value = canvas.toDataURL("image/jpeg", 0.75);
            };
            img.src = URL.createObjectURL(file);
        });
    }


    function getCards() {
        return Array.from(document.querySelectorAll('.contact-card'));
    }

    function applyDisplayPreferences() {
        const prefs = JSON.parse(localStorage.getItem('contactDisplayPrefs') || '{}');
        const sort = prefs.sort || 'az';
        const view = prefs.view || 'all';
        const compact = Boolean(prefs.compact);

        if (defaultSortSelect) defaultSortSelect.value = sort;
        if (defaultViewSelect) defaultViewSelect.value = view;
        if (compactModeCheckbox) compactModeCheckbox.checked = compact;

        if (contactList) {
            contactList.classList.toggle('contact-list-compact', compact);
            const cards = getCards();
            cards.sort((a, b) => {
                const nameA = a.dataset.name || '';
                const nameB = b.dataset.name || '';
                const pinA = a.dataset.pinned === 'true' ? 1 : 0;
                const pinB = b.dataset.pinned === 'true' ? 1 : 0;

                if (sort === 'pinned_first' && pinB !== pinA) {
                    return pinB - pinA;
                }
                if (sort === 'za') {
                    return nameB.localeCompare(nameA);
                }
                return nameA.localeCompare(nameB);
            });
            cards.forEach(card => contactList.appendChild(card));

            cards.forEach(card => {
                if (view === 'pinned_only') {
                    card.style.display = card.dataset.pinned === 'true' ? '' : 'none';
                } else {
                    card.style.display = '';
                }
            });
        }

        if (statusText) {
            statusText.textContent = view === 'pinned_only'
                ? 'Showing pinned contacts'
                : 'Showing all contacts';
        }
    }

    applyDisplayPreferences();

    function addCharacteristicRow(label = '', value = '') {
        const row = document.createElement('div');
        row.className = 'char-row';
        row.innerHTML = `
            <input type="text" name="custom_label[]" placeholder="Characteristic (e.g. Role)" value="${label}" required>
            <input type="text" name="custom_value[]" placeholder="Value (e.g. Manager)" value="${value}" required>
            <button type="button" class="char-remove">✕</button>
        `;
        row.querySelector('.char-remove').addEventListener('click', () => row.remove());
        charRowsContainer.appendChild(row);
    }

    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', () => {
            modalTitle.textContent = '📒 New Contact';
            contactForm.action = '/';
            contactForm.reset();
            if (avatarDataInput) avatarDataInput.value = '';
            charRowsContainer.innerHTML = '';
            modalOverlay.classList.add('active');
        });
    }

    document.querySelectorAll('.edit-contact-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modalTitle.textContent = '✏️ Edit Contact';
            contactForm.action = `/edit/${btn.dataset.id}/`;
            contactForm.querySelector('[name="name"]').value = btn.dataset.name;
            contactForm.querySelector('[name="phone"]').value = btn.dataset.phone;
            contactForm.querySelector('[name="email"]').value = btn.dataset.email;
            modalPinCheckbox.checked = btn.dataset.pinned === 'true';

            charRowsContainer.innerHTML = '';
            const jsonEl = document.getElementById(btn.dataset.id);
            if (jsonEl) {
                const fields = JSON.parse(jsonEl.textContent) || {};
                Object.entries(fields).forEach(([k, v]) => addCharacteristicRow(k, v));
            }
            modalOverlay.classList.add('active');
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => modalOverlay.classList.remove('active'));
    if (addCharRowBtn) addCharRowBtn.addEventListener('click', () => addCharacteristicRow());
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.classList.remove('active');
        });
    }

    if (menuAddCharBtn && newCharModal) {
        menuAddCharBtn.addEventListener('click', () => newCharModal.classList.add('active'));
        closeNewCharBtn.addEventListener('click', () => newCharModal.classList.remove('active'));
        cancelNewCharBtn.addEventListener('click', () => newCharModal.classList.remove('active'));
        newCharModal.addEventListener('click', (e) => {
            if (e.target === newCharModal) newCharModal.classList.remove('active');
        });
    }

    if (menuEditCharBtn && manageCharModal) {
        menuEditCharBtn.addEventListener('click', () => manageCharModal.classList.add('active'));
        closeManageCharBtn.addEventListener('click', () => manageCharModal.classList.remove('active'));
        manageCharModal.addEventListener('click', (e) => {
            if (e.target === manageCharModal) manageCharModal.classList.remove('active');
        });
    }

    if (menuFilterBtn && filterDisplayModal) {
        menuFilterBtn.addEventListener('click', () => filterDisplayModal.classList.add('active'));
        closeFilterModalBtn.addEventListener('click', () => filterDisplayModal.classList.remove('active'));
        cancelFilterModalBtn.addEventListener('click', () => filterDisplayModal.classList.remove('active'));
        filterDisplayModal.addEventListener('click', (e) => {
            if (e.target === filterDisplayModal) filterDisplayModal.classList.remove('active');
        });
        saveDisplayPrefsBtn.addEventListener('click', () => {
            localStorage.setItem('contactDisplayPrefs', JSON.stringify({
                sort: defaultSortSelect.value,
                view: defaultViewSelect.value,
                compact: compactModeCheckbox.checked,
            }));
            azLetters.forEach(s => s.classList.remove('active'));
            if (searchInput) searchInput.value = '';
            applyDisplayPreferences();
            filterDisplayModal.classList.remove('active');
        });
    }

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

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            azLetters.forEach(s => s.classList.remove('active'));
            statusText.textContent = query ? 'Searching for "' + query + '"' : 'Showing all contacts';
            getCards().forEach(card => {
                card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
            });
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            azLetters.forEach(s => s.classList.remove('active'));
            applyDisplayPreferences();
        });
    }
    
    azLetters.forEach(letter => {
        letter.addEventListener('click', () => {
            const char = letter.textContent;
            if (searchInput) searchInput.value = '';
            statusText.textContent = 'Showing contacts starting with "' + char + '"';
            azLetters.forEach(s => s.classList.remove('active'));
            letter.classList.add('active');
            getCards().forEach(card => {
                const name = card.getAttribute('data-name') || '';
                card.style.display = name.startsWith(char.toLowerCase()) ? '' : 'none';
                });
            });
        }); 
    });
    
