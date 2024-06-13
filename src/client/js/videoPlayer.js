const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const videoControlVolume = videoControls.querySelector(
  ".videoControls__volume"
);
const videoControlVolumeBar = videoControls.querySelector(
  ".videoControls__volume-bar"
);
const textarea = document.querySelector("#commentForm textarea");

let onFocusForm = false;
let controlsTimeout = null;
let controlsMovementTimeout = null;
let videoPlaying = false;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMute = (event) => {
  if (volumeRange.value == 0) {
    video.muted = false;
    volumeRange.value = volumeValue;
    muteBtnIcon.classList = "fas fa-volume-up";
  } else {
    video.muted = true;
    volumeRange.value = 0;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
};

const handleVolumeInput = (event) => {
  const {
    target: { value },
  } = event;
  video.volume = value;
  muteBtnIcon.classList =
    value == 0 ? "fas fa-volume-mute" : "fas fa-volume-up";
};

const handleVolumeChange = (event) => {
  if (volumeRange.value == 0) {
    return;
  }
  volumeValue = volumeRange.value;
};

const ONE_HOUR_IN_SECONDS = 60 * 60;

const formatTime = (seconds) => {
  if (seconds >= ONE_HOUR_IN_SECONDS) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
};
const handleLoadedmetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
  video.controls = false;
  videoControls.style.width = video.videoWidth + "px";
};
const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineUpdate = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const videoPuase = () => {
  videoPlaying = video.paused;
  video.pause();
};
const videoPlay = () => {
  if (!videoPlaying) {
    video.play();
  }
};

const handleFullscreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenBtnIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtnIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 1500);
};
const handleMouseLeave = () => {
  controlsTimeout = (hideControls, 1500);
};

const handleVolumeMouseEnter = () => {
  videoControlVolumeBar.classList.add("showing");
};
const handleVolumeMouseLeave = () => {
  videoControlVolumeBar.classList.remove("showing");
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeInput);
volumeRange.addEventListener("change", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedmetadata);
video.addEventListener("click", handlePlayClick);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineUpdate);
timeline.addEventListener("mousedown", videoPuase);
timeline.addEventListener("mouseup", videoPlay);
fullScreenBtn.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
document.addEventListener("keydown", (event) => {
  if (onFocusForm) {
    return;
  }
  if (event.key === " ") {
    handlePlayClick();
  } else if (event.key === "f" || event.key === "F") {
    handleFullscreen();
  }
});
videoControlVolume.addEventListener("mouseenter", handleVolumeMouseEnter);
videoControlVolume.addEventListener("mouseleave", handleVolumeMouseLeave);
textarea.addEventListener("focus", () => (onFocusForm = true));
textarea.addEventListener("blur", () => (onFocusForm = false));
