const form = document.querySelector('.imgForm');
const submintBtn = document.querySelector('.inputBtn');
const searchBtn = document.querySelector('.serchBtn');
const imgInput = document.querySelector('#file');
const lists = document.querySelector('.videolists');
const youtubeAPI = 'type your keys';
let result;

submintBtn.addEventListener('click', async (e) => {
  const myform = new FormData(form);
  myform.append('image', imgInput.files[0]);
  const data = await getName(myform);
  result = data.class_name;
  const resultPtag = document.querySelector('.machineName');
  resultPtag.innerHTML = `머신 분석 결과 : ${result}`;
});
searchBtn.addEventListener('click', () => {
  if (result == '') {
    return;
  } else {
    return fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${result}&key=${youtubeAPI}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        Autorization: `Bearer ${youtubeAPI}`,
      }
    )
      .then((res) => res.json())
      .then((data) => formatData(data.items))
      .then((data) => {
        const list = data.map(createHTMLString).join('');
        lists.innerHTML = list;
      });
  }
});

imgInput.addEventListener('change', (e) => {
  readURL(imgInput);
});

async function getName(form) {
  try {
    const res = await fetch('http://9e18-43-200-228-239.ngrok-free.app/', {
      method: 'POST',
      body: form,
    });
    return await res.json();
  } catch (data) {
    return console.error(data);
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('preview').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById('preview').src = '';
  }
}

function formatData(data) {
  return data.map((d) => {
    const obj = {
      id: d.id.videoId,
      title: d.snippet.title,
      thumbnail: d.snippet.thumbnails.default.url,
      channel: d.snippet.channelTitle,
    };
    return obj;
  });
}

function createHTMLString(obj) {
  const { id, title, thumbnail, channel } = obj;
  return `<li class="video" onClick="window.open('https://www.youtube.com/watch?v=${id}' + '_blank');">
  <img
    src="${thumbnail}"
    alt=""
    class="thumbnail"
    width="280px"
    height="157px"
  />
  <div class="description">
    <p class="des_title">
      ${title}
    </p>
    <p class="des_channel">${channel}</p>
  </div>
</li>`;
}
