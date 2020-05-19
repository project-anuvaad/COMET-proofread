export const generateConvertStages = function generateConvertStages() {
  return [{
    title: 'Step 1: Transcribing Video',
    completed: false,
    active: false,
  },
  {
    title: 'Step 2: Proof Reading Script',
    completed: false,
    active: false,
  },
  {
    title: 'Step 3: Converting to a VideoWiki video',
    completed: false,
    active: false,
  }]
}

export function formatTime(milliseconds, options) {
  if (!milliseconds) return '00:00';
  let seconds = milliseconds / 1000;
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  let millisecs = milliseconds % 1000;
  seconds = seconds - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  let time = minutes + ':' + seconds;
  if (options && options.milliseconds) {
    if ((parseFloat(seconds) === parseFloat(`0${seconds}`) || parseFloat(seconds) === 0) && String(seconds).indexOf('.') === -1) {
      time += '.000';
    }
    if ((9 - time.length) > 0) {
      for (let i = 0; i < Array(9 - time.length).length; i++) {
        time += '0';
      }
    }
    
  } else {
    time = time.substr(0, 5);
  }
  time = time.substr(0, 9)
  return time
}
export function removeMillisecondsFromFormattedTime(formattedTime) {
  if (!formattedTime || formattedTime.indexOf('.') === -1) return formattedTime;
  return formattedTime.split('.')[0];
}

export function isTimeFormatValid(formattedTime) {
  if (!formattedTime) return false;
  return !!formattedTime.match(/^[0-9]?[0-9]?\:[0-9]{0,2}?\.?[0-9]{0,3}?$/gi);
}

export function unformatTime(formattedTime) {
  if (!formattedTime) return { };
  let [minutes, seconds] = formattedTime.split(':');
  console.log('formatted time is', formattedTime, minutes, seconds, typeof seconds )
  let milliseconds = 0;
  minutes = parseInt(minutes);
  
  if (seconds.indexOf('.') === -1) {
    seconds = parseFloat(seconds);
  } else {
    milliseconds = parseInt(seconds.split('.')[1])
    seconds = parseInt(seconds.split('.')[0])
  }
  const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
  const totalMilliseconds = totalSeconds * 1000
  return { minutes, seconds, totalSeconds, totalMilliseconds };
}



export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function canUserAccess(user, organization, requiredRoles) {
  const userRole = user.organizationRoles.find((r) => r.organization._id === organization._id)
  let canView = false;
  if (userRole && userRole.organizationOwner) {
    canView = true;
  } else if (userRole) {
    if (userRole && userRole.permissions.some(p => requiredRoles.indexOf(p) !== -1)) {
      canView = true;
    }
  }
  return canView;
}

export function getUserOrganziationRole(user, organization) {
  if (!user || !organization) return null;
  return user.organizationRoles.find((r) => r.organization._id === organization._id);
}


export function getSlideAndSubslideIndexFromPosition(slides, slidePosition, subslidePosition) {
  const slideIndex = slides.findIndex((s) => parseInt(s.position) === parseInt(slidePosition));
  if (slideIndex === -1) return {};
  const subslideIndex = slides[slideIndex].content.findIndex((s) => parseInt(s.position) === parseInt(subslidePosition));
  return { slideIndex, subslideIndex };
}


export function removeExtension(fileName) {
  let newFileName = fileName.split('.');
  newFileName.pop();
  return newFileName.join('.');
}

export function removeExtensionAndLowercase(fileName) {
  return removeExtension(fileName).toLowerCase()
}


export function matchVideosWithSubtitels(videos, subtitlesFiles) {
  if (videos.length === 0) return videos;
  if (subtitlesFiles.length === 0) return videos;

  // Remove subtitlesFiles
  const subtitlesFilesNames = subtitlesFiles.map((s) => removeExtensionAndLowercase(s.name));
  videos.filter(v => !v.subtitle).forEach((video) => {
    console.log('video', video)
    const videoName = removeExtensionAndLowercase(video.content.name);
    if (subtitlesFilesNames.indexOf(videoName) !== -1) {
      video.hasSubtitle = true;
      video.subtitle = subtitlesFiles[subtitlesFilesNames.indexOf(videoName)];
    }
  })

  return videos;
}


export function showMoreText(text, length) {
  return text.length > length ? `${text.substr(0, length)} ...` : text;
}

export function getUsersByRoles(users, organization, roles) {
  return !users || !Array.isArray(users) ? [] : users.filter((user) => {
    const orgRole = user.organizationRoles.find(r => r.organization === organization._id);
    if (!orgRole) return false;

    if (roles.indexOf('owner') !== -1 && orgRole.organizationOwner) return true;

    if (orgRole.permissions.some(perm => roles.indexOf(perm) !== -1)) return true;
    return false;
  })
}

export function getUserNamePreview(user) {
  if (!user) return '';
  return user && user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.email;
}

export function reduceSlidesSubslides(slides) {
  return slides.reduce((acc, slide, slideIndex) => !slide.content || slide.content.length === 0 ? acc : acc.concat(slide.content.map(((subslide, subslideIndex) => ({ ...subslide, slidePosition: slide.position, subslidePosition: subslide.position, slideIndex, subslideIndex })))), [])
}

export function getSubslideIndex(slides, slidePosition, subslidePosition) {
  const subslides = reduceSlidesSubslides(slides);
  return subslides.findIndex((s) => s.slidePosition === slidePosition && s.position === subslidePosition);
}

export function getSpeakersTranslatorsMap(speakersProfile, translators, users) {
  if (!translators || !users) return {};
  const translatorsMap = {};
  const assignedSpeakers = translators.map(t => t.speakerNumber);
  speakersProfile.forEach(spk => {
    const translatorIndex = assignedSpeakers.indexOf(spk.speakerNumber);
    if (translatorIndex !== -1 && translators[translatorIndex]) {
      const assignedUser = users.find(u => u._id === translators[translatorIndex].user);
      if (assignedUser) {
        translatorsMap[spk.speakerNumber] = assignedUser;
      }
    }
  });
  return translatorsMap;
}

export function getUserName(user) {
  return user.firstname && user.lastname ? `${user.firstname} ${user.lastname} (${user.email})` : user.email;
}