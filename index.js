// ⚡️ Import Styles
import './style.scss';
import feather from 'feather-icons';
import { showNotification } from './modules/showNotification.js';

// ⚡️ Render Skeleton
document.querySelector('#app').innerHTML = `
<div class='app-container'>
  <div class='tts'>
    <h2 class='title'>Text To Speech</h2>
    <form data-form=''>
      <label>
        <span class='label'>Enter Text</span>
        <textarea name='text'></textarea>
      </label>
      <label>
        <span class='label'>Select Voice</span>
        <select name='voices' data-form-select=''></select>
      </label>
      <button class='button'>Convert To Speech</button>
    </form>
  </div>

  <a class='app-author' href='https://github.com/nagoev-alim' target='_blank'>${feather.icons.github.toSvg()}</a>
</div>
`;

// ⚡️Query Selectors
const DOM = {
  textarea: document.querySelector('textarea'),
  select: document.querySelector('[data-form-select]'),
  form: document.querySelector('[data-form]'),
};

const PROPS = {
  synth: speechSynthesis,
  isSpeaking: true,
};

/**
 * @function getVoices - Render Voices
 */
const getVoices = () => {
  for (let { name, lang } of PROPS.synth.getVoices()) {
    let option = `<option value='${name}' ${name === 'Google US English' ? 'selected' : ''}>${name} (${lang})</option>`;
    DOM.select.insertAdjacentHTML('beforeend', option);
  }
};

/**
 * @function textToSpeech - Speech text
 * @param text
 */
const textToSpeech = (text) => {
  let utterance = new SpeechSynthesisUtterance(text);
  for (let voice of PROPS.synth.getVoices()) {
    if (voice.name === DOM.select.value) {
      utterance.voice = voice;
    }
  }
  PROPS.synth.speak(utterance);
};

/**
 * @function onSubmit - Form submit event handler
 * @param event
 */
const onSubmit = (event) => {
  event.preventDefault();
  const form = event.target;
  const formBtn = form.querySelector('button');
  const text = Object.fromEntries(new FormData(form).entries()).text.trim();

  if (text.length === 0 || !text) {
    showNotification('warning', 'Please enter or paste something.');
    return;
  }

  if (!PROPS.synth.speaking) {
    textToSpeech(text);
  }

  if (text.length > 80) {
    setInterval(() => {
      if (!PROPS.synth.speaking && !PROPS.isSpeaking) {
        PROPS.isSpeaking = true;
        formBtn.innerText = 'Convert To Speech';
      } else {
      }
    }, 500);
    if (PROPS.isSpeaking) {
      PROPS.synth.resume();
      PROPS.isSpeaking = false;
      formBtn.innerText = 'Pause Speech';
    } else {
      PROPS.synth.pause();
      PROPS.isSpeaking = true;
      formBtn.innerText = 'Resume Speech';
    }
  } else {
    formBtn.innerText = 'Convert To Speech';
  }
};

// ⚡️Call functions
getVoices();

// ⚡️Events
PROPS.synth.addEventListener('voiceschanged', getVoices);
DOM.form.addEventListener('submit', onSubmit);
