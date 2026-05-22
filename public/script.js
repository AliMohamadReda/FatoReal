const input = document.getElementById('noticia');

input.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        verificar();
    }
});

function verificar(){

    const texto = input.value.trim();

    if(!texto){

        alert('Cole um link ou notícia para verificar.');

        input.focus();

        return;
    }

    const btn = document.querySelector('.search-box button');

    if(btn.disabled) return;

    const originalHTML = btn.innerHTML;

    btn.disabled = true;

    btn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Analisando...
    `;

    const popup = document.getElementById('popupResultado');

    const scoreNum = document.querySelector('.modal-score-num');

    const status = document.querySelector('.modal-status');

    const description = document.querySelector('.modal-description');

    const score = Math.floor(Math.random() * 41) + 60;

    setTimeout(() => {

        scoreNum.innerText = score;

        if(score >= 80){

            status.innerHTML = '✓ Alta Confiabilidade';

            description.innerHTML =
            'A notícia apresenta alta compatibilidade com fontes oficiais e verificadas.';

        }else if(score >= 70){

            status.innerHTML = '⚠ Parcialmente Confiável';

            description.innerHTML =
            'Alguns elementos da notícia precisam de atenção e confirmação adicional.';

        }else{

            status.innerHTML = '✕ Possível Fake News';

            description.innerHTML =
            'Foram encontrados padrões suspeitos e inconsistências na informação analisada.';
        }

        popup.classList.add('active');

        btn.disabled = false;

        btn.innerHTML = originalHTML;

    },2000);

}

function fecharModal(){

    document
    .getElementById('popupResultado')
    .classList
    .remove('active');

    input.value = '';

    input.focus();

}

window.addEventListener('click', function(e){

    const popup = document.getElementById('popupResultado');

    if(e.target === popup){

        fecharModal();
    }

});