
let startTime, endTime, watchId;
let distance = 0;
let timerInterval;

const homeScreen = document.getElementById('homeScreen');
const runningScreen = document.getElementById('runningScreen');
const resultScreen = document.getElementById('resultScreen');
const chargeScreen = document.getElementById('chargeScreen');

const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const chargeButton = document.getElementById('chargeButton');
const homeButton = document.getElementById('homeButton');
const distanceElement = document.getElementById('distance');
const timeElement = document.getElementById('time');
const batteryImage = document.getElementById('batteryImage');

const clickSound = new Audio('sounds/click.mp3');
const countUpSound = new Audio('sounds/countup.mp3');
const chargeSound = new Audio('sounds/charge.mp3');
const bgm = document.getElementById('bgm');

document.addEventListener('DOMContentLoaded', () => {
    bgm.volume = 0.5; // 音量を半分に設定
    bgm.play();
});

startButton.addEventListener('click', () => {
    playClickSound();
    startRun();
});
endButton.addEventListener('click', endRun);
chargeButton.addEventListener('click', () => {
    playChargeSound();
    showChargeScreen();
});
homeButton.addEventListener('click', () => {
    playClickSound();
    goHome();
});

function startRun() {
    startTime = new Date();
    distance = 0;
    distanceElement.textContent = distance;
    timeElement.textContent = 0;

    homeScreen.style.display = 'none';
    runningScreen.style.display = 'flex';

    /* ⭐ 星を追加する処理 */
    createStars(30, 'far'); // 遠い星を30個
    createStars(15, 'near'); // 近い星を15個

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, showError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    timerInterval = setInterval(updateTime, 1000);
}

function endRun() {
    endTime = new Date();
    navigator.geolocation.clearWatch(watchId);
    clearInterval(timerInterval);

    runningScreen.style.display = 'none';
    resultScreen.style.display = 'flex';

    const timeElapsed = Math.floor((endTime - startTime) / 1000);
    
    const formattedTime = formatTime(timeElapsed); // hh:mm:ss 形式に変換
    const formattedDist = formatDistance(distance); // 00.00 km 形式に変換
    
    playCountUpSound();
    animateCountUp(timeElement, timeElapsed, 1, 100, formatTime);
    animateCountUp(distanceElement, distance, 0.01, 100, formatDistance);

    // ⭐ ホーム画面と結果画面のスコアを更新
    document.getElementById('homeTime').textContent = formattedTime;
    document.getElementById('homeDist').textContent = formattedDist;

    // ❌ 修正前（要素が存在しない可能性あり）
    // document.getElementById('resultTime').textContent = formattedTime;
    // document.getElementById('resultDist').textContent = formattedDist;

    // ✅ 修正後：結果画面に対応する要素を作成・更新
    document.getElementById('time').textContent = formattedTime;
    document.getElementById('distance').textContent = formattedDist;
}

function showChargeScreen() {
    resultScreen.style.display = 'none';
    chargeScreen.style.display = 'flex';

    // バッテリーのイラストを変更
    batteryImage.src = 'images/battery_before.png';
    batteryImage.style.opacity = 1; // 初期状態で表示

    setTimeout(() => {
        batteryImage.src = 'images/battery_after.png';
    }, 1000); // 1秒後にバッテリーのイラストを変更
}

function goHome() {
    chargeScreen.style.display = 'none';
    homeScreen.style.display = 'flex';
    document.body.style.backgroundImage = "url('images/background_after.png')"; // 背景画像を変更
}

function updatePosition(position) {
    const { latitude, longitude } = position.coords;
    // 距離計算のロジックを追加する必要があります
    // ここでは簡単のために距離を固定値で増加させます
    distance += 0.01;
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function updateTime() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timeElement.textContent = timeElapsed;
}

function animateCountUp(element, target, step, intervalTime, formatFunc = (v) => v) {
    let current = 0;
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = formatFunc(current);
    }, intervalTime);
}


function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function playCountUpSound() {
    countUpSound.currentTime = 0;
    countUpSound.play();
}

function playChargeSound() {
    chargeSound.currentTime = 0;
    chargeSound.play();
}

/* ⭐ 星をランダムに生成する関数 */
function createStars(num, className) {
    for (let i = 0; i < num; i++) {
        let star = document.createElement('div');
        star.classList.add('star', className);
        
        // ランダムな位置を設定
        star.style.top = Math.random() * 100 + "vh";
        star.style.left = Math.random() * 100 + "vw";

        // 星を追加
        runningScreen.appendChild(star);
    }
}

function formatTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = seconds % 60;
    
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDistance(km) {
    return km.toFixed(2);
}
