const HEIGH_MAX = 1080 * 2;
const WIDTH_MIN = 0;
const WIDTH_MAX = 1920;

const state = {
  mapToNotes: false,
};

const notes = [
  16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87,
  32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55.00, 58.27, 61.74,
  65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.8, 110.0, 116.5, 123.5,
  130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185.0, 196.0, 207.7, 220.0, 233.1, 246.9,
]

const FREQUENCY_MIN = Math.min(...notes);
const FREQUENCY_MAX = Math.max(...notes);

const context = new AudioContext()

const gainNode = context.createGain();
gainNode.connect(context.destination);

const oscillators = [];

for (let i = 0; i < 2; i++) {
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.connect(gainNode);
  oscillators.push(oscillator);
}

const findClosestNote = (freqency) => {
  return notes.reduce((prev, curr) => (Math.abs(curr - freqency) < Math.abs(prev - freqency) ? curr : prev));  
}

const updateFrequency = () => {
  const widthRange = WIDTH_MAX - WIDTH_MIN;
  const frequencyRange = FREQUENCY_MAX - FREQUENCY_MIN;
  const frequency = FREQUENCY_MIN + (frequencyRange / widthRange) * Math.min(window.innerWidth, WIDTH_MAX);

  const time = context.currentTime + .0001;

  for (const i in oscillators) {
    const frequencyMultiplier = 2 ** i;
    const closestNote = state.mapToNotes ? findClosestNote(frequency) : frequency;
    const actualFrequency = closestNote + closestNote * frequencyMultiplier;

    oscillators[i].frequency.setValueAtTime(actualFrequency, time);
  }
};

const updateGain = () => {
  gainNode.gain.value = Math.min(window.innerHeight, HEIGH_MAX) / HEIGH_MAX;
};

const updateColor = () => {
  const color1 = Math.min(window.innerWidth, WIDTH_MAX) / WIDTH_MAX * 255;
  const color2 = Math.min(window.innerHeight, HEIGH_MAX) / HEIGH_MAX * 255;
  document.body.style.backgroundColor = `rgb(${color1},${color2},${255 - color2})`;
};

const update = () => {
  updateGain();
  updateFrequency();
  updateColor();
};

const addEventListeners = () => {
  window.addEventListener('keydown', (e) => {
    if (e.key !== ' ') {
      return;
    }

    document.querySelector('h1').innerHTML = 'Resize the window to play music <br /> <br /> Press "n" to toggle note mode';

    update();

    for (const oscillator of oscillators) {
      oscillator.start();
    }
  });

  window.addEventListener('resize', () => {
    update();
  });

  window.addEventListener('keypress', (e) => {
    if (e.key === 'n') {
      state.mapToNotes = ! state.mapToNotes;

      update();
    }
  });
};

const mobileOrTablet = () => {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

if (! mobileOrTablet()) {
  addEventListeners();
} else {
  document.querySelector('h1').innerHTML = 'This only works on a desktop browser';
}

update();
