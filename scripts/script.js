
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
    startTime = new Date(); // 開始時間を記録
    distance = 0; // 距離をリセット
    distanceElement.textContent = distance;
    timeElement.textContent = 0;

    homeScreen.style.display = 'none';
    runningScreen.style.display = 'flex';

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
    endTime = new Date(); // 終了時間を記録
    navigator.geolocation.clearWatch(watchId); // 位置情報の取得を停止
    clearInterval(timerInterval); // タイマーを停止

    runningScreen.style.display = 'none';
    resultScreen.style.display = 'flex';

    const timeElapsed = Math.floor((endTime - startTime) / 1000); // 経過時間を計算
    playCountUpSound(); // カウントアップ開始時に音を鳴らす
    animateCountUp(distanceElement, distance, 0.01, 100); // 距離をカウントアップ
    animateCountUp(timeElement, timeElapsed, 1, 100); // 時間をカウントアップ
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
    document.body.style.backgroundImage = "url('images/background_after.jpeg')"; // 背景画像を変更
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

function animateCountUp(element, target, step, intervalTime) {
    let current = 0;
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = current.toFixed(2);
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
