/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var stream;
var nframes = 1024;
var sample_rate = 44100.0;
var freqs = [];
for (var i = 0; i < nframes; ++i) {
    freqs.push(0.0);
}
var counter = 0;
var source;
var toggleBtn = 0;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        freqs[0] = 0.0;
        for (var i = 1; i < nframes/2; ++i) {
            freqs[i] = (i*sample_rate)/nframes;
            freqs[nframes-i] = -freqs[i];
        }
        freqs[nframes/2] = ((nframes/2)*sample_rate)/nframes;

        var audioCtx = undefined;
        var getUserMedia;
        var analyser;
        var gainNode;
        document.querySelector('button').addEventListener('click', function() {

            
            
            
            
            if (typeof audioCtx == "undefined") { 
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                // Some browsers partially implement mediaDevices. We can't just assign an object
                // with getUserMedia as it would overwrite existing properties.
                // Here, we will just add the getUserMedia property if it's missing.
                if (navigator.mediaDevices.getUserMedia === undefined) {
                    navigator.mediaDevices.getUserMedia = function(constraints) {

                    // First get ahold of the legacy getUserMedia, if present
                    getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

                    // Some browsers just don't implement it - return a rejected promise with an error
                    // to keep a consistent interface
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                    }

                    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                    return new Promise(function(resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject);
                    });
                    }
                }
                
                analyser = audioCtx.createAnalyser();
                analyser.fftSize = 1024;
                gainNode = audioCtx.createGain();
            }

            if (toggleBtn == 0) {
                toggleBtn = 1;
                gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, 0);
            } else {
                toggleBtn = 0;
                gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0);
                // window.cancelAnimationFrame(analyzeSignal);
                return;
            }

            

            if (navigator.mediaDevices.getUserMedia) {
                console.log('getUserMedia supported.');
                var constraints = {audio: true}
                navigator.mediaDevices.getUserMedia (constraints)
                   .then(
                     function(stream) {
                        source = audioCtx.createMediaStreamSource(stream);
                        source.connect(gainNode);
                        gainNode.connect(analyser);
                        analyser.connect(audioCtx.destination);
                        
                        function analyzeSignal() {
                            if (toggleBtn ==1) 
                            requestAnimationFrame(analyzeSignal);
                            
                            // console.log("++++++++++++++++++++++++++++++++++");
                            // Get Signal values
                            // analyser.fftSize = 2048;
                            // var bufferLength = analyser.fftSize;
                            // var dataArray = new Uint8Array(bufferLength);
                            // analyser.getByteTimeDomainData(dataArray);
                            // console.log("SIGNAL:")
                            // console.log(bufferLength);
                            // console.log(dataArray);
                            // console.log("FFT:");
                            
                            var bufferLengthAlt = analyser.frequencyBinCount;
                            var dataArrayAlt = new Uint8Array(bufferLengthAlt);
                            analyser.getByteFrequencyData(dataArrayAlt);
                            // console.log(bufferLengthAlt);
                            var max_values = [];
                            
                            for (var i = 0; i < 512; ++i) {

                                // console.log("FREQ(" + freqs[i] + "): " + dataArrayAlt[i]);
                                max_values.push({"Freq":freqs[i], "value": dataArrayAlt[i]});

                            }
                            max_values.sort(function(a,b){
                                return a.value - b.value;
                            });
                            // console.log(max_values);
                            var signal_values_text = document.getElementById("signal_values_text");
                            var stringChanges = "TOP 3 Frequencies \n";
                            stringChanges += "Freq: " + max_values[511].Freq + " Value : " + max_values[511].value + "\n";
                            stringChanges += "Freq: " + max_values[510].Freq + " Value : " + max_values[510].value + "\n";
                            stringChanges += "Freq: " + max_values[509].Freq + " Value : " + max_values[509].value + "\n";
                            signal_values_text.innerText = stringChanges;
                        }
                        
                        requestAnimationFrame(analyzeSignal);



                   })
                   .catch( function(err) { console.log('The following gUM error occured: ' + err);})
             } else {
                console.log('getUserMedia not supported on your browser!');
             }
        
          
        });
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();