const video = document.getElementById("video");
const cv = document.getElementById("cv");


Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models")
]);

function startWebcam() {
  navigator.mediaDevices.getUserMedia({
    "video": true,
    audio: false
  }).then((stream) => {
    video.srcObject = stream;
  }).catch((error) => {
    stopWebcam();
    // console.error(error);
  })
}

function stopWebcam() {
  var stream = video.srcObject;
  var tracks = stream.getTracks();

  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    track.stop();
  }
  video.srcObject = null;
}

function getLabeledFaceDescriptions() {
  const labels = window.labels_db
  const labels_name = Object.keys(window.labels_db);

  return Promise.all(
    labels_name.map(async (label) => {
      const descriptions = [];
      let image = labels[label]["link"];
      console.log(image)
      
const image1 = await faceapi.fetchImage(image)

console.log(image1 instanceof HTMLImageElement)
      // const image = await faceapi.fetchImage(base64);
      const detections = await faceapi
        .detectSingleFace(image1, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      console.log(detections);
if (detections==null||detections=="undefined")
{
  alert("Face image quality of "+labels[label]["imgName"]+" is poor for labelling, please upload face image again!!!");
  return;
}
      descriptions.push(detections.descriptor);
      // }
      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  );
}


// function getLabeledFaceDescriptions() {
//   const labels_db = localStorage.getItem('labels_db');
//   const labels = ["Mitanshu", "Messi"];
//   console.log(labels)
//   return Promise.all(
//     labels.map(async (label) => {
//       const descriptions = [];

//       for (i = 1; i <= 2; i++) {
//         const image = await faceapi.fetchImage(`./labels/${label}/${i}.jpg`);
//         const detections = await faceapi
//           .detectSingleFace(image)
//           .withFaceLandmarks()
//           .withFaceDescriptor();
//       console.log(detections)

//         descriptions.push(detections.descriptor);
//       }
//       return new faceapi.LabeledFaceDescriptors(label, descriptions)
//     })
//   );
// }

video.addEventListener('play', async () => {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
  console.log("Detecting faces...")
  const canvas = faceapi.createCanvasFromMedia(video);
  // document.body.append(canvas);
  cv.appendChild(canvas)


  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    const results = resizedDetections.map((d) => {
      return faceMatcher.findBestMatch(d.descriptor);
    });
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, { label: result });
      drawBox.draw(canvas);
      // faceapi.draw.drawDetections(canvas, resizedDetections);
      // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    })

  }, 1000);
});
