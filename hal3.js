// Membuat bintang latar
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 70; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;
  star.style.animationDuration = `${1 + Math.random() * 2}s`;
  star.style.opacity = Math.random();
  starsContainer.appendChild(star);
}

// Ambil elemen penting
const video = document.getElementById("birthdayVideo");
const bgSound = document.getElementById("bgSound");
const leftImage = document.getElementById("leftImage");
const rightImage = document.getElementById("rightImage");
const nextButton = document.getElementById("nextButton");

// Pause musik saat video diputar
video.addEventListener("play", () => {
  bgSound.pause();
});

// Munculkan gambar saat video sampai detik ke-9
video.addEventListener("timeupdate", () => {
  if (video.currentTime >= 9 && !leftImage.classList.contains("show-image")) {
    leftImage.classList.add("show-image");
    rightImage.classList.add("show-image");
  }
});

// Munculkan tombol dan nyalakan lagi musik setelah video selesai
video.addEventListener("ended", () => {
  nextButton.classList.add("show");
  bgSound.play(); // Musik latar hidup lagi
});

// Perbesar & perkecil saat klik
let currentFocus = null;

function resetAll() {
  video.classList.remove("active", "shrink");
  leftImage.classList.remove("active", "shrink");
  rightImage.classList.remove("active", "shrink");
  currentFocus = null;
}

leftImage.addEventListener("click", () => {
  if (currentFocus === "left") {
    resetAll();
  } else {
    currentFocus = "left";
    video.classList.add("shrink");
    leftImage.classList.add("active");
    rightImage.classList.add("shrink");

    rightImage.classList.remove("active");
    video.classList.remove("active");
    leftImage.classList.remove("shrink");
  }
});

rightImage.addEventListener("click", () => {
  if (currentFocus === "right") {
    resetAll();
  } else {
    currentFocus = "right";
    video.classList.add("shrink");
    rightImage.classList.add("active");
    leftImage.classList.add("shrink");

    leftImage.classList.remove("active");
    video.classList.remove("active");
    rightImage.classList.remove("shrink");
  }
});

video.addEventListener("click", () => {
  if (currentFocus === "video") {
    resetAll();
  } else {
    currentFocus = "video";
    video.classList.add("active");
    leftImage.classList.add("shrink");
    rightImage.classList.add("shrink");

    leftImage.classList.remove("active");
    rightImage.classList.remove("active");
    video.classList.remove("shrink");
  }
});
