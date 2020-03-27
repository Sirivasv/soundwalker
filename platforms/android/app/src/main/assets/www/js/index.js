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
        document.querySelector('button').addEventListener('click', function() {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            var audioCtx = new AudioContext();
          
            // create Oscillator and gain node
            var oscillator = audioCtx.createOscillator();
            var gainNode = audioCtx.createGain();
          
            // connect oscillator to gain node to speakers
          
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
          
            // create initial theremin frequency and volumn values
          
            var WIDTH = window.innerWidth;
            var HEIGHT = window.innerHeight;
          
            var maxFreq = 6000;
            var maxVol = 0.02;
          
            var initialFreq = 440;
            var initialVol = 0.015;
          
            // set options for the oscillator
          
          
            oscillator.detune.value = 100; // value in cents
            oscillator.start(0);
          
            oscillator.onended = function() {
              console.log('Your tone has now stopped playing!');
            };
          
            gainNode.gain.value = initialVol;
            gainNode.gain.minValue = initialVol;
            gainNode.gain.maxValue = initialVol;
          
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