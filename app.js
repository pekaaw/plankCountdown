var FM = FM || {};
FM.plankCountdown = FM.plankCountdown || function plankCountdown() {
    var container = document.querySelector("section#app");
    var minutesHolder = container.querySelector("#minutes");
    var secondsHolder = container.querySelector("#seconds");
    var visualTimerHolder = container.querySelector(".visualTimer");
    var inPlanking = false;

    const sounds = (function() {
        return {
            plankingIn5minutes: document.querySelector("audio.plankingIn5minutes"),
            plankingIn1minute: document.querySelector("audio.plankingIn1minute"),
            plankingIn10: document.querySelector("audio.plankingIn10"),
            plankingIn5: document.querySelector("audio.plankingIn5"),
            plankingIn4: document.querySelector("audio.plankingIn4"),
            plankingIn3: document.querySelector("audio.plankingIn3"),
            plankingIn2: document.querySelector("audio.plankingIn2"),
            plankingIn1: document.querySelector("audio.plankingIn1"),
            start: document.querySelector("audio.start"),
            left30seconds: document.querySelector("audio.left30seconds"),
            left10seconds: document.querySelector("audio.left10seconds"),
            done: document.querySelector("audio.done"),
        };
    })();

    Number.prototype.pad = Number.prototype.pad || function (size) {
        var s = String(this);
        while (s.length < (size || 2)) { s = "0" + s; }
        return s;
    }

    function startTimestamp() {
        return new Date();
    }

    function nextPlankTime() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0, 0);
    }

    function updateVisualTimer(fraction) {
        let visualTimer = document.querySelector(".visualTimer");
        let visualTimerCircle = visualTimer.querySelector("circle.visualTimerForeground");
        let visualTimerBackground = visualTimer.querySelector("circle.visualTimerBackground");

        var radius = visualTimer.getBBox().width / 2;
        var circumference = 2 * Math.PI * radius;

        circleOffset = circumference * fraction + "";

        visualTimerCircle.style.strokeDasharray = circumference;
        visualTimerCircle.style.strokeDashoffset = circleOffset;

        visualTimerBackground.style.strokeDasharray = circumference;
        visualTimerBackground.style.strokeDashoffset = circumference * (1.0 - fraction) + "";
    };

    let diff = (function () {
        function timeDiff(from, to) {
            return Math.abs(to.getTime() - from.getTime());
        }
        let hours = function (from, to) { return Math.floor(timeDiff(from, to) / (1000 * 3600)); }
        let minutes = function (from, to) { return Math.floor(timeDiff(from, to) / (1000 * 60)); }
        let seconds = function (from, to) { return Math.ceil(timeDiff(from, to) / 1000); }

        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    })();

    (function update() {
        var now = new Date();
        var plankTime = nextPlankTime();

        let minutesToNext = diff.minutes(now, plankTime);
        let seconds = diff.seconds(now, plankTime);
        let secondsToNext = seconds % 60;
        if (secondsToNext == 0) minutesToNext++;
        minutesHolder.innerHTML = minutesToNext.pad();
        secondsHolder.innerHTML = secondsToNext.pad();

        let fraction = (1 - (seconds / (60 * 60)));

        let exercise = function () {
            sounds.start.play();
            inPlanking = true;

            (function displayImage() {
                var image = document.createElement("img");
                image.src = "exercise.gif";
                image.classList.add("exercise");
                container.insertBefore(image, visualTimerHolder);
            })();

            function clearSounds() {
                let audios = document.querySelectorAll("audio");
                for(var i = 0, length = audios.length; i < length; ++i) {
                    audios[i].dataset.hasPlayed = null;
                }
            };

            setTimeout(function only30secondsLeft() {
                sounds.left30seconds.play();
            }, 30 * 1000);

            setTimeout(function only10secondsLeft() {
                sounds.left10seconds.play();
            }, 50 * 1000);

            setTimeout(function removeImage() {
                document.querySelector("img.exercise").remove();
                sounds.done.play();
                inPlanking = false;
                setTimeout(clearSounds, 1500);
            }, 60 * 1000);
        };

        if (minutesToNext === 5 && secondsToNext === 0 && sounds.plankingIn5minutes.dataset.hasPlayed !== "true") {
            sounds.plankingIn5minutes.play();
            sounds.plankingIn5minutes.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 1 && secondsToNext === 0 && sounds.plankingIn1minute.dataset.hasPlayed !== "true") {
            sounds.plankingIn1minute.play();
            sounds.plankingIn1minute.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 0 && secondsToNext === 10 && sounds.plankingIn10.dataset.hasPlayed !== "true") {
            sounds.plankingIn10.play();
            sounds.plankingIn10.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 0 && secondsToNext === 6 && sounds.plankingIn5.dataset.hasPlayed !== "true") {
            setTimeout(function () { sounds.plankingIn5.play(); }, 250);
            sounds.plankingIn5.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 0 && secondsToNext === 4 && sounds.plankingIn4.dataset.hasPlayed !== "true") {
            sounds.plankingIn4.play();
            sounds.plankingIn4.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 0 && secondsToNext === 3 && sounds.plankingIn3.dataset.hasPlayed !== "true") {
            sounds.plankingIn3.play();
            sounds.plankingIn3.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 0 && secondsToNext === 2 && sounds.plankingIn2.dataset.hasPlayed !== "true") {
            sounds.plankingIn2.play();
            sounds.plankingIn2.dataset.hasPlayed = true;
        }
        else if (minutesToNext === 0 && secondsToNext === 1 && sounds.plankingIn1.dataset.hasPlayed !== "true") {
            sounds.plankingIn1.play();
            sounds.plankingIn1.dataset.hasPlayed = true;
            setTimeout(exercise, sounds.plankingIn1.duration * 1000);
        }
        
        if (inPlanking) {
            updateVisualTimer(1 - ((seconds) / 60));
        } else {
            updateVisualTimer(fraction);
        }

        requestAnimationFrame(update);
    })();

};
