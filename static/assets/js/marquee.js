// Ensure GSAP plugins are registered
gsap.registerPlugin(ScrollTrigger);

function horizontalInfiniteMarquee(options) {
  // Default configuration
  const config = {
    marqueeSelector: ".marqueeOne",
    spinningStarSelector: ".spinningStar",
    marqueeDuration: 30,
    spinningRotation: 1440,
    spinningDuration: 40,
    hoverPause: true, // Enable/disable hover pause
  };

  // Merge user-provided options with defaults
  Object.assign(config, options);

  let direction = 1;

  // Ensure the elements exist in the DOM
  const marquee = document.querySelector(config.marqueeSelector);
  const spinningStar = document.querySelector(config.spinningStarSelector);

  // Check if the marquee element exists
  if (marquee) {
    // Marquee animation setup
    const roll1 = roll(config.marqueeSelector, {
      duration: config.marqueeDuration,
    });

    // Scroll trigger for marquee
    ScrollTrigger.create({
      onUpdate(self) {
        if (self.direction !== direction) {
          direction *= -1;
          roll1.timeScale(direction * 15);
          gsap.to([roll1], {
            timeScale: direction,
            overwrite: true,
            duration: 1,
          });
        }
      },
    });

    // Hover pause functionality (if enabled)
    if (config.hoverPause) {
      marquee.addEventListener("mouseenter", () => {
        roll1.pause();
        if (spinningStar) {
          tween.pause(); // Pause the spinning animation
        }
      });
      marquee.addEventListener("mouseleave", () => {
        roll1.resume();
        if (spinningStar) {
          tween.resume(); // Resume the spinning animation
        }
      });
    }
  }

  // Check if the spinning star element exists
  let tween;
  if (spinningStar) {
    // Spinning star animation setup
    tween = gsap.to(config.spinningStarSelector, {
      rotation: config.spinningRotation,
      duration: config.spinningDuration,
      ease: "none",
      repeat: -1,
    });

    // Set initial progress
    tween.progress(0.5);

    // Scroll trigger for spinning star
    ScrollTrigger.create({
      trigger: config.spinningStarSelector,
      start: "center center",
      end: "+=5000",
      onUpdate({ getVelocity }) {
        const velocity = getVelocity();

        let timeScale = 1;
        let endTimeScale = 1;

        if (velocity > 1) {
          timeScale = 1;
        } else {
          timeScale = -1;
          endTimeScale = -1;
        }

        gsap.to(tween, {
          duration: 0.05,
          timeScale: timeScale,
        });

        gsap.to(tween, {
          duration: 0.05,
          timeScale: endTimeScale,
          delay: 1,
        });
      },
    });
  }

  // Marquee rolling animation function
  function roll(targets, vars, reverse) {
    vars = vars || {};
    vars.ease || (vars.ease = "none");
    const tl = gsap.timeline({
        repeat: -1,
        onReverseComplete() {
          this.totalTime(this.rawTime() + this.duration() * 100);
        },
      }),
      elements = gsap.utils.toArray(targets),
      clones = elements.map((el) => {
        let clone = el.cloneNode(true);
        el.parentNode.appendChild(clone);
        return clone;
      }),
      positionClones = () =>
        elements.forEach((el, i) =>
          gsap.set(clones[i], {
            position: "absolute",
            overwrite: false,
            top: el.offsetTop,
            left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
          })
        );
    positionClones();
    elements.forEach((el, i) =>
      tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0)
    );
    window.addEventListener("resize", () => {
      let time = tl.totalTime();
      tl.totalTime(0);
      positionClones();
      tl.totalTime(time);
    });
    return tl;
  }
}

// Wait for DOM content to load before initializing
document.addEventListener("DOMContentLoaded", () => {
  horizontalInfiniteMarquee({
    marqueeSelector: ".marqueeOne",
    spinningStarSelector: ".spinningStar",
    marqueeDuration: 40, // Speed up marquee scrolling
    spinningRotation: 720, // Reduce spin amount
    spinningDuration: 20, // Make spinning faster
    hoverPause: true, // Enable pause on hover
  });
});
