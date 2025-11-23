document.addEventListener('DOMContentLoaded', () => {
    let tatuagensData = [];
    const cardContainer = document.querySelector('.card-container');

    function carregarTatuagens() {
        if (!tatuagensData || tatuagensData.length === 0) {
            cardContainer.innerHTML = '<p style="color: #e8eaed; text-align: center;">Nenhum dado encontrado.</p>';
            return;
        }
        exibirCards(tatuagensData);
    }

    function exibirCards(tatuagens) {
        cardContainer.innerHTML = '';
        tatuagens.forEach(tatuagem => {
            const card = document.createElement('article');
            card.className = 'card';
            // Garante que todas as propriedades existem
            const nome = tatuagem.nome || '';
            const descricao = tatuagem.descricao || '';
            const origem = tatuagem.origem_periodo || '';
            const tags = Array.isArray(tatuagem.tags) ? tatuagem.tags : [];
            const imagens = Array.isArray(tatuagem.imagens) ? tatuagem.imagens : [];
            const link = tatuagem.link_referencia || '#';
            const tagsHtml = tags.map(tag => `<strong>${tag}</strong>`).join(', ');
            const imagensHtml = imagens.map(imgSrc => `
                <img src="${imgSrc}" alt="Exemplo de tatuagem ${nome}" style="width:150px; height:150px; object-fit:cover; border-radius:8px; cursor:pointer;">
            `).join('');
            card.innerHTML = `
                <h2>${nome}</h2>
                <p>${descricao}</p>
                <p><strong>Origem:</strong> ${origem}</p>
                <p><strong>Tags:</strong> ${tagsHtml}</p>
                <div class="card-images">
                    ${imagensHtml}
                </div>
                <a href="${link}" target="_blank">Saiba mais</a>
            `;
            cardContainer.appendChild(card);
        });
        document.querySelectorAll('.card-images img').forEach(img => {
            img.addEventListener('click', expandirImagem);
        });
    }

    function expandirImagem(event) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        modal.style.display = 'block';
        modalImg.src = event.target.src;
        modalImg.alt = event.target.alt;
    }

    const modal = document.getElementById('imageModal');
    const closeModal = document.querySelector('.close-modal');
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Carrega os dados do data.json após DOM pronto
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            tatuagensData = data;
            window.tatuagensData = tatuagensData;
            window.exibirCards = exibirCards;
            window.cardContainer = cardContainer;
            carregarTatuagens();
        })
        .catch(() => {
            cardContainer.innerHTML = '<p style="color: #e8eaed; text-align: center;">Falha ao carregar os estilos de tatuagem. Tente novamente mais tarde.</p>';
        });
});

function iniciarBusca() {
    if (!window.tatuagensData) return;
    const termo = document.querySelector('.search-container input').value.trim().toLowerCase();
    if (!termo) return;
    const resultados = window.tatuagensData.filter(tatuagem =>
        tatuagem.nome.toLowerCase().includes(termo) ||
        tatuagem.descricao.toLowerCase().includes(termo) ||
        tatuagem.tags.some(tag => tag.toLowerCase().includes(termo))
    );
    if (resultados.length > 0) {
        window.exibirCards(resultados);
    } else {
        window.cardContainer.innerHTML = '<p style="color: #e8eaed; text-align: center;">Nenhum estilo encontrado para "' + termo + '".</p>';
    }
}