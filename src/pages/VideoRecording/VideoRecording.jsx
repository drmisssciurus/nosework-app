import React, { useState, useEffect, useRef } from 'react';

import styles from './VideoRecording.module.css';
import Footer from '../../components/Footer/Footer';

const VideoRecorder = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    // Получаем список медиа-устройств
    const getDevices = async () => {
      try {
        console.log('Requesting access to the camera...');
        await navigator.mediaDevices.getUserMedia({ video: true }); // Permission to access the camera
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );
        console.log('Available devices:', videoDevices);
        setDevices(videoDevices);
        if (videoDevices.length > 0)
          setSelectedDevice(videoDevices[0].deviceId);
      } catch (error) {
        console.error('Error accessing devices:', error);
      }
    };
    getDevices();
  }, []);

  const startRecording = async () => {
    if (!selectedDevice) {
      console.error('Camera not selected');
      return;
    }
    try {
      console.log('Request access to the selected camera:', selectedDevice);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: selectedDevice } },
      });

      console.log('Video stream received:', stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/mp4';
      }
      console.log('Используемый MIME-тип:', options.mimeType);

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        console.log('New piece of data available:', event.data);
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        console.log(
          'Recording stopped. Number of pieces:',
          chunksRef.current.length
        );
        const blob = new Blob(chunksRef.current, { type: options.mimeType });
        console.log('Created Blob:', blob);
        setVideoBlob(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      console.log('Recording start');
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    console.log('Recording stop');
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
  };

  const handleDeviceChange = (event) => {
    console.log('Device selected:', event.target.value);
    setSelectedDevice(event.target.value);
  };

  return (
    <div className="container">
      <div className={styles.videoRecorder}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Record Trial</h1>
          <p className={styles.instruction}>
            Choose your camera and then press the button - start. When you
            finish recording trial press stop button.
          </p>
        </div>

        {devices.length > 0 && (
          <div className={styles.selectCameraContainer}>
            <label className={styles.chooseCameraLbl} htmlFor="device">
              Select preferred camera:
            </label>
            <select
              className={styles.select}
              id="device"
              onChange={handleDeviceChange}
              value={selectedDevice}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Камера ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={styles.videoWindow}
        />

        <div className={styles.btnsContainer}>
          {!isRecording ? (
            <button className={styles.btnStart} onClick={startRecording}>
              Start recording
            </button>
          ) : (
            <button className={styles.btnStop} onClick={stopRecording}>
              Stop recording
            </button>
          )}
        </div>

        {videoBlob && (
          <div>
            <a href={URL.createObjectURL(videoBlob)} download="video.webm">
              Download video
            </a>
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
};

export default VideoRecorder;
